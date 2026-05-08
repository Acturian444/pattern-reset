require('dotenv').config();
const express = require('express');
const path = require('path');
const crypto = require('crypto');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_YOUR_STRIPE_SECRET_KEY');
const app = express();

/** Respect X-Forwarded-* when deployed behind Vercel/CDN for accurate IP-based rate limiting */
app.set('trust proxy', true);

/** Match js/funnel/offer-constants.js — human labels for Stripe-driven profile updates */
const OFFER_LABELS = {
    fast_clarity_19: '$19 — See what to do next (in-modal breakdown)',
    direct_read_59: '$59 — Direct written answer for your situation',
    decide_with_me_197: '$197 — 1:1 call (decide with me)',
};

/**
 * Pattern Reset — Stripe catalog defaults for "Get a Direct Answer" ($59, live).
 * Used only when STRIPE_PRICE_PERSONAL_RELATIONSHIP_READ and STRIPE_PRODUCT_PERSONAL_RELATIONSHIP_READ are both unset
 * (missing .env locally or unset on host). Set either env var to override.
 * For Stripe **test** mode, set STRIPE_PRICE_PERSONAL_RELATIONSHIP_READ to a **test** price_… in .env so it matches sk_test.
 */
const DEFAULT_STRIPE_PRICE_PERSONAL_RELATIONSHIP_READ = 'price_1TNUFLBiV6S6xuimZH8beoiV';

// ============================================================
// Google Form sync — mirrors js/services/google-form-sync.js
// Appends a "paid" row when the Stripe webhook confirms payment.
// Firestore is source of truth; this is for read-prep in the Sheet.
// ============================================================
const QUIZ_GOOGLE_FORM_URL =
    'https://docs.google.com/forms/d/e/1FAIpQLScmI_KSBc9bOt4QtHn5SpNP1kM5sW4HaFLekWOoI-hYsohMjw/formResponse';
const QUIZ_GOOGLE_FORM_ENTRIES = {
    uid: 'entry.1249010722',
    submissionId: 'entry.2069187980',
    name: 'entry.1716594260',
    email: 'entry.112273991',
    patternName: 'entry.1850600286',
    patternKey: 'entry.874331934',
    herPatternName: 'entry.967380028',
    herPatternKey: 'entry.1673434558',
    patternDominance: 'entry.202062538',
    secondaryPatternName: 'entry.2108321205',
    secondaryDriverPercentage: 'entry.237005794',
    futureView: 'entry.773964952',
    decisionBlock: 'entry.1838342344',
    desiredOutcome: 'entry.1292610039',
    userIntent: 'entry.133337482',
    currentPain: 'entry.450863586',
    relationshipStage: 'entry.1621250187',
    relationshipDuration: 'entry.657288868',
    patternScope: 'entry.1693005378',
    whatIsHappening: 'entry.1224893574',
    whatTheyWant: 'entry.733137858',
    entryPath: 'entry.554632693',
    entrySource: 'entry.2018514612',
    paidOffer: 'entry.857270776',
    deliveryStatus: 'entry.32899186',
};

/** Builds URL-encoded Body for Relationship Quiz Google Sheet sync (matches js/services/google-form-sync payload keys). */
function buildQuizGoogleFormParamsFromData(data) {
    if (!data || typeof data !== 'object') return null;
    const params = new URLSearchParams();
    const MAX_FIELD = 5000;
    const trunc = (v, maxLen) => {
        if (v === undefined || v === null || v === '') return null;
        const s = String(v);
        const t = s.length > maxLen ? s.slice(0, maxLen) : s;
        return t.trim() === '' ? null : t;
    };
    const add = (entryId, value, maxLen = MAX_FIELD) => {
        if (!entryId) return;
        const t = trunc(value, maxLen);
        if (t == null) return;
        params.append(entryId, t);
    };
    const E = QUIZ_GOOGLE_FORM_ENTRIES;
    add(E.uid, data.uid, 200);
    add(E.submissionId, data.submissionId, 220);
    add(E.name, data.name, 200);
    add(E.email, data.email, 320);
    add(E.patternName, data.patternName, 400);
    add(E.patternKey, data.patternKey, 120);
    add(E.herPatternName, data.herPatternName, 400);
    add(E.herPatternKey, data.herPatternKey, 120);
    add(E.patternDominance, data.patternDominance != null ? String(data.patternDominance) : '', 40);
    add(E.secondaryPatternName, data.secondaryPatternName, 400);
    add(E.secondaryDriverPercentage, data.secondaryDriverPercentage != null ? String(data.secondaryDriverPercentage) : '', 40);
    add(E.futureView, data.futureView, MAX_FIELD);
    add(E.decisionBlock, data.decisionBlock, MAX_FIELD);
    add(E.desiredOutcome, data.desiredOutcome, MAX_FIELD);
    add(E.userIntent, data.userIntent, MAX_FIELD);
    add(E.currentPain, data.currentPain, MAX_FIELD);
    add(E.relationshipStage, data.relationshipStage, 240);
    add(E.relationshipDuration, data.relationshipDuration, 240);
    add(E.patternScope, data.patternScope, 320);
    add(E.whatIsHappening, data.whatIsHappening, MAX_FIELD);
    add(E.whatTheyWant, data.whatTheyWant, MAX_FIELD);
    add(E.entryPath, data.entryPath, 120);
    add(E.entrySource, data.entrySource, 320);
    add(E.paidOffer, data.paidOffer, 400);
    add(E.deliveryStatus, data.deliveryStatus || data.delivery_status, 120);
    return params;
}

async function postQuizFormHttpUrlencoded(params) {
    const resp = await fetch(QUIZ_GOOGLE_FORM_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        body: params.toString(),
        redirect: 'manual',
    });
    if (resp.status >= 400) {
        throw new Error(`Google Form HTTP ${resp.status}`);
    }
}

async function postPaidRowToGoogleForm(data) {
    if (!data) return;
    try {
        const params = buildQuizGoogleFormParamsFromData({
            ...data,
            deliveryStatus: data.deliveryStatus || data.delivery_status || 'paid',
        });
        if (!params || [...params.keys()].length === 0) return;
        await postQuizFormHttpUrlencoded(params);
    } catch (err) {
        console.warn('google form paid-row POST failed', err.message);
    }
}

/** Rough IP throttle for quiz Sheet mirror — stops blind flooding of /api/quiz-google-form-sync */
const quizGoogleSyncLimiter = new Map(); // ip -> { count, resetAt }
function quizGoogleSyncRateOk(ipRaw, windowMs = 15 * 60 * 1000, maxPerWindow = 48) {
    const ip = String(ipRaw || 'unknown').slice(0, 128);
    const now = Date.now();
    let bucket = quizGoogleSyncLimiter.get(ip);
    if (!bucket || now > bucket.resetAt) {
        quizGoogleSyncLimiter.set(ip, { count: 1, resetAt: now + windowMs });
        return true;
    }
    if (bucket.count >= maxPerWindow) return false;
    bucket.count += 1;
    return true;
}

async function verifyQuizGoogleSyncAppCheck(req) {
    const enforce = process.env.QUIZ_GOOGLE_SYNC_REQUIRE_APP_CHECK === 'true';
    const token = req.get('X-Firebase-AppCheck');
    const admin = getFirebaseAdmin();

    if (enforce) {
        if (!admin) {
            console.error('QUIZ_GOOGLE_SYNC_REQUIRE_APP_CHECK=true but FIREBASE_SERVICE_ACCOUNT_JSON is missing');
            return { ok: false, status: 503, reason: 'server_misconfigured' };
        }
        if (!token) {
            return { ok: false, status: 401, reason: 'app_check_required' };
        }
    }
    if (!token || !admin) {
        return { ok: true };
    }
    try {
        await admin.appCheck().verifyToken(token);
        return { ok: true };
    } catch (e) {
        if (enforce) {
            return { ok: false, status: 401, reason: 'invalid_app_check' };
        }
        // Permissive mode: still allow Sheet sync if App Check is misconfigured in dev.
        console.warn('App Check verify skipped (non-enforcing):', e.message);
        return { ok: true };
    }
}

// Stripe webhook — raw body required for signature verification (must run before express.json)
app.post(
    '/api/stripe-webhook',
    express.raw({ type: 'application/json', limit: '2mb' }),
    async (req, res) => {
        const secret = process.env.STRIPE_WEBHOOK_SECRET;
        if (!secret) {
            console.warn('STRIPE_WEBHOOK_SECRET not set; ignoring Stripe webhook verification');
            return res.status(200).json({ ok: false, reason: 'webhook_secret_missing' });
        }
        let event;
        try {
            event = stripe.webhooks.constructEvent(req.body, req.get('stripe-signature'), secret);
        } catch (err) {
            console.error('Stripe webhook signature:', err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }
        try {
            if (event.type === 'checkout.session.completed') {
                const session = event.data.object;
                const meta = session.metadata || {};
                if (meta.product === 'personal_relationship_read') {
                    await syncPersonalReadPaymentToFirestore(session, meta);
                }
            }
        } catch (err) {
            console.error('Stripe webhook handler error:', err);
        }
        res.json({ received: true });
    }
);

// ============================================================
// Calendly webhook — captures $197 booking confirmations.
// Mirrors Stripe webhook semantics: writes paid intakeSubmissions doc,
// updates quizProfiles rollup, appends "paid" row to Google Sheet.
// Linkage to quiz state rides on Calendly's `tracking` channel
// (utm_term = quizSubmissionId, salesforce_uuid = firebase uid),
// set client-side in clarity-paywall.js when the user clicks Book.
// Requires raw body for HMAC-SHA256 signature verification (must run
// before express.json), so this block lives alongside the Stripe webhook.
// ============================================================
function verifyCalendlyWebhookSignature(rawBody, signatureHeader, secret) {
    if (!signatureHeader || !secret) return false;
    const parts = String(signatureHeader).split(',').reduce((acc, pair) => {
        const idx = pair.indexOf('=');
        if (idx <= 0) return acc;
        const k = pair.slice(0, idx).trim();
        const v = pair.slice(idx + 1).trim();
        acc[k] = v;
        return acc;
    }, {});
    const t = parts.t;
    const v1 = parts.v1;
    if (!t || !v1) return false;
    const data = `${t}.${rawBody.toString('utf8')}`;
    let expected;
    try {
        expected = crypto.createHmac('sha256', secret).update(data).digest('hex');
    } catch (e) {
        return false;
    }
    try {
        const a = Buffer.from(expected, 'hex');
        const b = Buffer.from(v1, 'hex');
        if (a.length !== b.length) return false;
        return crypto.timingSafeEqual(a, b);
    } catch (e) {
        return false;
    }
}

app.post(
    '/api/calendly-webhook',
    express.raw({ type: 'application/json', limit: '2mb' }),
    async (req, res) => {
        const secret = process.env.CALENDLY_WEBHOOK_SIGNING_KEY;
        const sig = req.get('Calendly-Webhook-Signature');
        if (!secret) {
            console.warn('CALENDLY_WEBHOOK_SIGNING_KEY not set; ignoring Calendly webhook');
            return res.status(200).json({ ok: false, reason: 'webhook_secret_missing' });
        }
        if (!verifyCalendlyWebhookSignature(req.body, sig, secret)) {
            console.error('Calendly webhook signature mismatch');
            return res.status(400).send('Webhook Error: invalid signature');
        }
        let event;
        try {
            event = JSON.parse(req.body.toString('utf8'));
        } catch (e) {
            console.error('Calendly webhook JSON parse failed:', e.message);
            return res.status(400).send('Invalid JSON');
        }
        try {
            const evType = event && event.event;
            const payload = event && event.payload;
            if (evType === 'invitee.created') {
                await syncCalendlyBookingToFirestore(payload, 'paid');
            } else if (evType === 'invitee.canceled') {
                await syncCalendlyBookingToFirestore(payload, 'canceled');
            }
        } catch (err) {
            console.error('Calendly webhook handler error:', err);
        }
        // Always 200 so Calendly doesn't retry indefinitely on transient errors.
        res.json({ received: true });
    }
);

async function syncCalendlyBookingToFirestore(payload, status) {
    const admin = getFirebaseAdmin();
    if (!payload) {
        console.warn('Calendly sync skipped: empty payload');
        return;
    }
    if (!admin) {
        console.warn('Calendly sync skipped: firebase-admin not initialized');
        return;
    }

    const tracking = payload.tracking || {};
    const uid = String(tracking.salesforce_uuid || '').trim();
    const submissionId = String(tracking.utm_term || '').trim();
    const patternKey = String(tracking.utm_content || '').trim();
    const offerId = 'decide_with_me_197';
    const offerLabel = OFFER_LABELS[offerId] || null;

    const inviteeEmail = String(payload.email || '').trim().toLowerCase();
    const inviteeName = String(payload.name || '').trim();
    const inviteeUri = String(payload.uri || '').trim();
    const scheduled = payload.scheduled_event || {};
    const scheduledStart = scheduled.start_time || null;
    const scheduledEnd = scheduled.end_time || null;
    const scheduledEventUri = scheduled.uri || null;
    const eventName = scheduled.name || '';

    // Best-effort mapping from free-form Calendly Q&A to our intake fields.
    // The exact question text is owner-controlled in Calendly's dashboard, so
    // we keyword-match instead of slot-match. We always store the raw Q&A
    // array on the intake doc as `calendlyQuestionsAnswers` for completeness.
    const qa = Array.isArray(payload.questions_and_answers) ? payload.questions_and_answers : [];
    const findAnswer = (...keywords) => {
        for (let k = 0; k < keywords.length; k++) {
            const kw = String(keywords[k]).toLowerCase();
            for (let i = 0; i < qa.length; i++) {
                const q = String(qa[i].question || '').toLowerCase();
                if (q.indexOf(kw) !== -1) return String(qa[i].answer || '').trim();
            }
        }
        return '';
    };
    const whatIsHappening = findAnswer('happening', 'situation', 'going on');
    const whatTheyWant = findAnswer('answered', 'want', 'need', 'help');
    const relationshipStage = findAnswer('stage', 'where are', 'status');
    const relationshipDuration = findAnswer('how long', 'duration', 'together');

    const db = admin.firestore();
    const FieldValue = admin.firestore.FieldValue;
    const now = FieldValue.serverTimestamp();

    // Deterministic intake doc id keyed off the Calendly invitee URI →
    // re-deliveries (Calendly auto-retries on 5xx) merge instead of duplicating.
    const idSeed = inviteeUri || scheduledEventUri || ('calendly_' + Date.now());
    const intakeId = ('cal_' + String(idSeed)).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 240);

    const customerStatus = status === 'paid' ? 'paid_197' : 'paid_197_canceled';
    const paymentStatus = status === 'paid' ? 'paid' : 'canceled';
    const deliveryStatus = status === 'paid' ? 'pending_call' : 'canceled';

    const batch = db.batch();
    const intakeRef = db.collection('intakeSubmissions').doc(intakeId);
    const intakeData = {
        uid: uid || null,
        profileId: uid || null,
        submissionId: submissionId || null,
        quizSubmissionId: submissionId || null,
        source: 'clarity-paywall-197',
        provider: 'calendly',
        entryPath: 'quiz',
        entrySource: tracking.utm_source || null,
        entryCampaign: tracking.utm_campaign || null,
        offerId,
        patternKey: patternKey || null,
        email: inviteeEmail || null,
        name: inviteeName || null,
        whatIsHappening: whatIsHappening || null,
        whatDoYouNeedAnswered: whatTheyWant || null,
        relationshipStage: relationshipStage || null,
        relationshipDuration: relationshipDuration || null,
        paymentStatus,
        deliveryStatus,
        deliveredAt: null,
        scheduledStart,
        scheduledEnd,
        scheduledEventUri,
        scheduledEventName: eventName,
        calendlyInviteeUri: inviteeUri,
        calendlyQuestionsAnswers: qa,
        updatedAt: now,
    };
    if (status === 'paid') {
        intakeData.paidAt = now;
        intakeData.createdAt = now;
    } else {
        intakeData.canceledAt = now;
    }
    batch.set(intakeRef, intakeData, { merge: true });

    // Profile + submission + event log only if we have a uid we can attach to.
    // No uid still produces a complete intakeSubmissions row; ops can match by email.
    if (uid) {
        const profileRef = db.collection('quizProfiles').doc(uid);
        const profileUpdate = {
            latestPaymentStatus: paymentStatus,
            latestPaidOffer: offerId,
            latestPaidOfferLabel: offerLabel,
            selectedOffer: offerId,
            selectedOfferLabel: offerLabel,
            latestCustomerJourneyStage: status === 'paid' ? 'paid' : 'canceled',
            latestIntakeId: intakeId,
            customerStatus,
            updatedAt: now,
        };
        if (status === 'paid') profileUpdate.convertedAt = now;
        batch.set(profileRef, profileUpdate, { merge: true });

        if (submissionId) {
            const subRef = profileRef.collection('submissions').doc(submissionId);
            const subUpdate = {
                paymentStatus,
                paidOffer: offerId,
                paidOfferLabel: offerLabel,
                selectedOffer: offerId,
                selectedOfferLabel: offerLabel,
            };
            if (status === 'paid') subUpdate.convertedAt = now;
            batch.set(subRef, subUpdate, { merge: true });
        }

        const evRef = profileRef.collection('events').doc();
        batch.set(evRef, {
            uid,
            eventType: status === 'paid' ? 'payment_succeeded' : 'booking_canceled',
            createdAt: now,
            source: 'calendly_webhook',
            submissionId: submissionId || null,
            patternKey: patternKey || null,
            herPatternKey: null,
            offerId,
            offerLabel,
            page: '',
            path: '/api/calendly-webhook',
            sessionId: null,
            intakeId,
            entryPath: 'quiz',
            entrySource: tracking.utm_source || null,
            entryCampaign: tracking.utm_campaign || null,
            metadata: {
                calendlyInviteeUri: inviteeUri,
                scheduledStart,
                scheduledEnd,
                scheduledEventName: eventName,
            },
        });
    }

    await batch.commit();

    // Append paid row to Google Sheet for ops visibility (only on confirmed booking).
    // Cancellations stay in Firestore but don't pollute the Sheet.
    if (status === 'paid') {
        try {
            await postPaidRowToGoogleForm({
                uid: uid || '',
                submissionId: submissionId || '',
                name: inviteeName,
                email: inviteeEmail,
                patternName: '',
                patternKey: patternKey || '',
                herPatternName: '',
                herPatternKey: '',
                relationshipStage: relationshipStage || '',
                relationshipDuration: relationshipDuration || '',
                whatIsHappening: whatIsHappening || '',
                whatTheyWant: whatTheyWant || '',
                entryPath: 'quiz',
                entrySource: tracking.utm_source || '',
                paidOffer: offerLabel || offerId,
                deliveryStatus: 'paid_call_booked',
            });
        } catch (err) {
            console.warn('google form paid-row sync (calendly) failed', err.message);
        }
    }
}

// Parse JSON bodies for all other routes
app.use(express.json({ limit: '2mb' }));

/**
 * Stripe Checkout Session metadata: max 50 keys, each value max 500 chars.
 * Splits a JSON payload across keys ip0, ip1, … for webhook / ops retrieval.
 */
function buildPrReadIntakeMetadata(intakePayload) {
    const meta = { product: 'personal_relationship_read' };
    let raw;
    try {
        raw = JSON.stringify(intakePayload == null ? {} : intakePayload);
    } catch (e) {
        raw = '{}';
    }
    const maxChunk = 450;
    const maxKeys = 45;
    let part = 0;
    for (let offset = 0; offset < raw.length && part < maxKeys; offset += maxChunk, part++) {
        meta['ip' + part] = raw.slice(offset, offset + maxChunk);
    }
    meta.ip_count = String(part);
    meta.ip_raw_len = String(raw.length);
    if (raw.length > maxChunk * maxKeys) {
        meta.ip_trunc = '1';
    }
    return meta;
}

let firebaseAdminSingleton;
function getFirebaseAdmin() {
    if (firebaseAdminSingleton !== undefined) {
        return firebaseAdminSingleton;
    }
    const rawJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (!rawJson || !rawJson.trim()) {
        firebaseAdminSingleton = null;
        return null;
    }
    try {
        const admin = require('firebase-admin');
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert(JSON.parse(rawJson)),
            });
        }
        firebaseAdminSingleton = admin;
        return admin;
    } catch (e) {
        console.error('firebase-admin init failed:', e.message);
        firebaseAdminSingleton = null;
        return null;
    }
}

function reassemblePrReadIntakePayload(meta) {
    const count = parseInt(meta.ip_count || '0', 10) || 0;
    let raw = '';
    for (let i = 0; i < count; i++) {
        raw += meta['ip' + i] || '';
    }
    try {
        return JSON.parse(raw);
    } catch (e) {
        return {};
    }
}

async function syncPersonalReadPaymentToFirestore(session, meta) {
    const admin = getFirebaseAdmin();
    const payload = reassemblePrReadIntakePayload(meta);
    const funnel = payload.funnelContext || {};
    const uid = String(funnel.firebaseUid || '').trim();
    const intakeId = String(funnel.intakeId || '').trim();
    const offerId = String(funnel.offerId || 'direct_read_59').trim().slice(0, 64);
    const submissionId = String(funnel.quizSubmissionId || '').trim();
    if (!admin || !uid || !intakeId) {
        console.warn('Firestore payment sync skipped', {
            hasAdmin: !!admin,
            hasUid: !!uid,
            hasIntakeId: !!intakeId,
        });
        return;
    }
    const db = admin.firestore();
    const FieldValue = admin.firestore.FieldValue;
    const now = FieldValue.serverTimestamp();
    let customerStatus = 'paid';
    if (offerId === 'direct_read_59') {
        customerStatus = 'paid_59';
    } else if (offerId === 'fast_clarity_19') {
        customerStatus = 'paid_19';
    } else if (offerId === 'decide_with_me_197') {
        customerStatus = 'paid_197';
    }

    const batch = db.batch();
    const intakeRef = db.collection('intakeSubmissions').doc(intakeId);
    batch.set(
        intakeRef,
        {
            paymentStatus: 'paid',
            checkoutSessionId: session.id,
            stripePaymentIntentId: session.payment_intent || null,
            updatedAt: now,
            paidAt: now,
        },
        { merge: true }
    );

    const profileRef = db.collection('quizProfiles').doc(uid);
    const offerLabel = OFFER_LABELS[offerId] || null;
    batch.set(
        profileRef,
        {
            latestPaymentStatus: 'paid',
            latestPaidOffer: offerId,
            latestPaidOfferLabel: offerLabel,
            selectedOffer: offerId,
            selectedOfferLabel: offerLabel,
            latestCustomerJourneyStage: 'paid',
            latestIntakeId: intakeId,
            customerStatus,
            convertedAt: now,
            updatedAt: now,
        },
        { merge: true }
    );

    if (submissionId) {
        const subRef = profileRef.collection('submissions').doc(submissionId);
        batch.set(
            subRef,
            {
                paymentStatus: 'paid',
                paidOffer: offerId,
                paidOfferLabel: offerLabel,
                selectedOffer: offerId,
                selectedOfferLabel: offerLabel,
                convertedAt: now,
            },
            { merge: true }
        );
    }

    const evRef = profileRef.collection('events').doc();
    batch.set(evRef, {
        uid,
        eventType: 'payment_succeeded',
        createdAt: now,
        source: 'stripe_webhook',
        submissionId: submissionId || null,
        patternKey: null,
        herPatternKey: null,
        offerId,
        offerLabel,
        page: '',
        path: '/api/stripe-webhook',
        sessionId: null,
        intakeId,
        entryPath: null,
        entrySource: null,
        entryCampaign: null,
        metadata: { stripeCheckoutSessionId: session.id },
    });

    await batch.commit();

    // Append a "paid" row to the linked Google Sheet so ops can see the conversion
    // without opening Firestore. Uses the same UID + Submission ID as earlier rows.
    try {
        const intake = payload.intake || {};
        const quiz = payload.quizSnapshot || {};
        await postPaidRowToGoogleForm({
            uid,
            submissionId,
            name: intake.name || '',
            email: intake.email || '',
            patternName: quiz.patternName || '',
            patternKey: quiz.patternKey || '',
            herPatternName: quiz.herPatternName || '',
            herPatternKey: quiz.herPatternKey || '',
            relationshipStage: intake.stageLabel || intake.stage || '',
            relationshipDuration: intake.durationLabel || intake.duration || '',
            patternScope: intake.scopeLabel || intake.scope || '',
            whatIsHappening: intake.happening || '',
            whatTheyWant: intake.wantKnow || '',
            entryPath: payload.entryPath || '',
            entrySource: payload.entrySource || '',
            paidOffer: offerLabel || offerId,
            deliveryStatus: 'paid',
        });
    } catch (err) {
        console.warn('google form paid-row sync failed', err.message);
    }
}

// Add CORS headers for Vercel
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Handle OPTIONS requests for CORS
app.options('/create-checkout-session', (req, res) => {
    res.status(200).end();
});

// Publishable key for client Checkout (safe to expose; must match STRIPE_SECRET_KEY account)
app.get('/api/stripe-client-config', (req, res) => {
    const publishableKey =
        process.env.STRIPE_PUBLISHABLE_KEY ||
        process.env.STRIPE_PUBLIC_KEY ||
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
        '';
    res.status(200).json({ publishableKey: publishableKey });
});

// Create checkout session endpoint
app.post('/create-checkout-session', async (req, res) => {
    try {
        const { type, postId, priceId, successUrl, cancelUrl } = req.body;

        let sessionConfig = {
            payment_method_types: ['card'],
            mode: 'payment',
            success_url: successUrl,
            cancel_url: cancelUrl,
            allow_promotion_codes: true,
        };

        if (type === 'pack_purchase' && priceId) {
            // Premium Prompt Pack: Use the Stripe Price ID
            sessionConfig.line_items = [{
                price: priceId,
                quantity: 1,
            }];
        } else if (type === 'course_purchase' && priceId) {
            // Digital Course Purchase: Use the Stripe Price ID
            sessionConfig.line_items = [{
                price: priceId,
                quantity: 1,
            }];
        } else if (type === 'post_unlock') {
            // Let It Out – Unlock Replies: Use the Stripe Price ID for $4.99
            sessionConfig.line_items = [{
                price: 'price_1RaPPMQ1hjqBwoa0vVLHNXO1',
                quantity: 1,
            }];
            sessionConfig.metadata = { postId: postId };
        } else if (type === 'event_ticket' && priceId) {
            // Common Ground Social Club – Event ticket
            sessionConfig.line_items = [{
                price: priceId,
                quantity: 1,
            }];
            sessionConfig.metadata = {
                eventId: req.body.eventId || '',
                email: req.body.email || '',
            };
        } else if (type === 'personal_relationship_read') {
            // $59 Personal Relationship Read — server-owned Stripe price resolution.
            // Resolve in this order:
            //   (1) STRIPE_PRICE_PERSONAL_RELATIONSHIP_READ if valid
            //   (2) DEFAULT_STRIPE_PRICE_PERSONAL_RELATIONSHIP_READ if valid
            //   (3) first active one-time price from STRIPE_PRODUCT_PERSONAL_RELATIONSHIP_READ
            // This prevents stale env values (deleted or wrong-mode price IDs) from causing 500s.
            const envPriceId = (process.env.STRIPE_PRICE_PERSONAL_RELATIONSHIP_READ || '').trim();
            const prodId = (process.env.STRIPE_PRODUCT_PERSONAL_RELATIONSHIP_READ || '').trim();
            const candidatePriceIds = [];
            if (envPriceId) candidatePriceIds.push(envPriceId);
            if (DEFAULT_STRIPE_PRICE_PERSONAL_RELATIONSHIP_READ && envPriceId !== DEFAULT_STRIPE_PRICE_PERSONAL_RELATIONSHIP_READ) {
                candidatePriceIds.push(DEFAULT_STRIPE_PRICE_PERSONAL_RELATIONSHIP_READ);
            }

            let prPriceId = '';
            let lastPriceErr = null;
            for (let i = 0; i < candidatePriceIds.length; i++) {
                const candidate = candidatePriceIds[i];
                try {
                    const price = await stripe.prices.retrieve(candidate);
                    if (price && price.active && price.type === 'one_time') {
                        prPriceId = price.id;
                        break;
                    }
                } catch (e) {
                    lastPriceErr = e;
                    console.warn('Stripe prices.retrieve (personal_relationship_read):', candidate, e && e.message);
                }
            }

            if (!prPriceId && prodId) {
                try {
                    const prices = await stripe.prices.list({
                        product: prodId,
                        active: true,
                        limit: 10,
                    });
                    const oneTime = prices.data.find((p) => p.type === 'one_time');
                    prPriceId = oneTime ? oneTime.id : (prices.data[0] && prices.data[0].id) || '';
                } catch (listErr) {
                    console.error('Stripe prices.list (personal_relationship_read):', listErr);
                    res.status(503).json({
                        error: 'Could not look up price for this product.',
                        hint: 'Check STRIPE_PRODUCT_PERSONAL_RELATIONSHIP_READ and Stripe key mode (test vs live).',
                    });
                    return;
                }
            }

            if (!prPriceId) {
                res.status(503).json({
                    error: 'Payment is not configured for this product.',
                    hint: 'Set a valid STRIPE_PRICE_PERSONAL_RELATIONSHIP_READ (price_…) or STRIPE_PRODUCT_PERSONAL_RELATIONSHIP_READ (prod_…) on the server.',
                    details: lastPriceErr && lastPriceErr.message ? String(lastPriceErr.message) : undefined,
                });
                return;
            }

            sessionConfig.line_items = [{
                price: prPriceId,
                quantity: 1,
            }];
            if (req.body.customerEmail) {
                sessionConfig.customer_email = String(req.body.customerEmail).slice(0, 254);
            }
            // Funnel IDs must live inside intakePayload (chunked into ip0…), not as extra metadata keys — Stripe allows max 50 keys.
            sessionConfig.metadata = buildPrReadIntakeMetadata(req.body.intakePayload || {});
        } else {
            // Usually: old deployment missing `personal_relationship_read` branch, or POST not hitting this server (static host only).
            res.status(400).json({
                error: 'Invalid purchase type or missing priceId.',
                hint:
                    'Personal Relationship Read needs type "personal_relationship_read" and the latest server.js. Deploy current server.js to Vercel, or run `node server.js` locally. For local static HTML only, /create-checkout-session will not exist.',
                receivedType: type == null ? null : String(type),
            });
            return;
        }

        const session = await stripe.checkout.sessions.create(sessionConfig);

        res.json({ id: session.id });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        const stripeType = error && error.type ? String(error.type) : '';
        const stripeCode = error && error.code ? String(error.code) : '';
        const stripeMsg = error && error.message ? String(error.message) : '';
        const hint =
            stripeType.indexOf('StripeAuthenticationError') !== -1
                ? 'Check STRIPE_SECRET_KEY on the server (and ensure mode matches your price IDs).'
                : stripeCode === 'resource_missing'
                    ? 'A configured Stripe Price/Product was not found. Recheck STRIPE_PRICE_PERSONAL_RELATIONSHIP_READ / STRIPE_PRODUCT_PERSONAL_RELATIONSHIP_READ.'
                    : undefined;
        res.status(500).json({
            error: 'Failed to create checkout session',
            details: stripeMsg || undefined,
            hint,
        });
    }
});

/**
 * Quiz → Google Sheet snapshot relay.
 * Keeps Form entry IDs server-side (client no longer POSTs Google formResponse URLs directly).
 */
app.post('/api/quiz-google-form-sync', async (req, res) => {
    try {
        const fwd = req.headers['x-forwarded-for'];
        const ipRaw =
            req.ip ||
            (typeof fwd === 'string' ? fwd.split(',')[0].trim() : '') ||
            req.socket?.remoteAddress ||
            '';
        if (!quizGoogleSyncRateOk(ipRaw)) {
            return res.status(429).json({ ok: false, error: 'rate_limited' });
        }
        const gate = await verifyQuizGoogleSyncAppCheck(req);
        if (!gate.ok) {
            return res.status(gate.status).json({ ok: false, error: gate.reason });
        }
        const body = req.body && typeof req.body === 'object' ? req.body : {};
        const keys = Object.keys(body).filter((k) => body[k] !== '' && body[k] !== undefined && body[k] !== null);
        if (keys.length === 0) {
            return res.status(400).json({ ok: false, error: 'empty_body' });
        }
        const params = buildQuizGoogleFormParamsFromData(body);
        if (!params || [...params.keys()].length === 0) {
            return res.status(400).json({ ok: false, error: 'nothing_to_sync' });
        }
        await postQuizFormHttpUrlencoded(params);
        res.json({ ok: true });
    } catch (err) {
        console.warn('/api/quiz-google-form-sync:', err.message);
        res.status(502).json({ ok: false, error: 'upstream_failed' });
    }
});

// Common Ground — Proxy Google Form submission (bypasses CORS)
const GOOGLE_FORM_ID = '1FAIpQLSeh3-Du0MCwiR_2LFEei7B0Zb4j1awjVZmcv53Mcvh8-HU8tA';

// Health check so client can verify proxy is reachable (GET returns 200)
app.get('/api/common-ground-google-form', (req, res) => {
    res.status(200).json({ ok: true, message: 'Common Ground proxy is running' });
});
const GOOGLE_FORM_ENTRIES = {
    firstName: 'entry.504887360',
    lastName: 'entry.921056307',
    email: 'entry.1621528979',
    phone: 'entry.1679131526',
    city: 'entry.1280727653',
    ageRange: 'entry.1396150302',
    instagram: 'entry.2145352710',
    clubs: 'entry.80467545',
    lifeStage: 'entry.411252689',
    availability: 'entry.531603476',
    relationshipStatus: 'entry.739447362',
    whyJoin: 'entry.1657656904',
    eventInterest: 'entry.788276730',
    attendPreference: 'entry.468543992',
    guidelinesAgreed: 'entry.159152994',
    contactShareConsent: 'entry.314471581',
};

app.post('/api/common-ground-google-form', async (req, res) => {
    try {
        const data = req.body;
        const params = new URLSearchParams();
        const add = (key, val) => { if (key) params.append(key, val == null ? '' : String(val)); };
        add(GOOGLE_FORM_ENTRIES.firstName, data.firstName);
        add(GOOGLE_FORM_ENTRIES.lastName, data.lastName);
        add(GOOGLE_FORM_ENTRIES.email, data.email);
        add(GOOGLE_FORM_ENTRIES.phone, data.phone);
        add(GOOGLE_FORM_ENTRIES.city, data.city);
        add(GOOGLE_FORM_ENTRIES.ageRange, data.ageRange);
        add(GOOGLE_FORM_ENTRIES.instagram, data.instagram);
        add(GOOGLE_FORM_ENTRIES.clubs, Array.isArray(data.clubs) ? data.clubs.join(', ') : data.clubs);
        add(GOOGLE_FORM_ENTRIES.lifeStage, data.lifeStageStr || (Array.isArray(data.lifeStage) ? data.lifeStage.join(', ') : ''));
        add(GOOGLE_FORM_ENTRIES.availability, data.availabilityStr || (Array.isArray(data.availability) ? data.availability.join(', ') : ''));
        add(GOOGLE_FORM_ENTRIES.relationshipStatus, data.relationshipStatus);
        add(GOOGLE_FORM_ENTRIES.whyJoin, data.whyJoin);
        add(GOOGLE_FORM_ENTRIES.eventInterest, data.eventInterest);
        add(GOOGLE_FORM_ENTRIES.attendPreference, data.attendPreference);
        add(GOOGLE_FORM_ENTRIES.guidelinesAgreed, data.guidelinesAgreed ? 'Yes' : 'No');
        add(GOOGLE_FORM_ENTRIES.contactShareConsent, data.contactShareConsent ? 'Yes' : 'No');

        const formUrl = `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/formResponse`;
        const proxyRes = await fetch(formUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Origin': 'https://docs.google.com',
                'Referer': `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/viewform`,
            },
            body: params.toString(),
        });
        if (!proxyRes.ok) {
            const errText = await proxyRes.text();
            console.error('Common Ground: Google Form rejected', proxyRes.status, 'params:', params.toString().slice(0, 300), 'response:', errText.slice(0, 300));
            return res.status(502).json({ error: 'Google Form rejected submission', status: proxyRes.status });
        }
        res.status(200).json({ ok: true });
    } catch (err) {
        console.error('Common Ground Google Form proxy error:', err);
        res.status(500).json({ error: 'Failed to submit to Google Form' });
    }
});

// Verify checkout session endpoint (SECURE)
app.get('/api/verify-checkout', async (req, res) => {
    try {
        const { session } = req.query;
        
        if (!session) {
            return res.status(400).json({ error: 'Session ID required' });
        }

        // Retrieve the checkout session from Stripe
        const checkoutSession = await stripe.checkout.sessions.retrieve(session);
        
        // Check if payment was successful
        if (checkoutSession.payment_status === 'paid') {
            const meta = checkoutSession.metadata || {};
            const product =
                meta.product === 'personal_relationship_read'
                    ? 'personal_relationship_read'
                    : 'breakup_reset';
            res.json({
                verified: true,
                course: product,
                message: 'Payment verified successfully',
            });
        } else {
            res.status(402).json({ 
                verified: false, 
                error: 'Payment not completed' 
            });
        }
    } catch (error) {
        console.error('Error verifying checkout session:', error);
        res.status(500).json({ error: 'Failed to verify payment' });
    }
});

// Clean URLs — same mapping as vercel.json rewrites (local `node server.js` has no Vercel layer)
const _prRoot = path.join(__dirname);
const _cleanHtml = [
    ['home', 'home.html'],
    ['personal-relationship-read', 'personal-relationship-read.html'],
    ['letitout', 'letitout.html'],
];
_cleanHtml.forEach(function (pair) {
    var base = '/' + pair[0];
    var file = pair[1];
    app.get(base, function (req, res) {
        res.sendFile(path.join(_prRoot, file));
    });
    app.get(base + '/', function (req, res) {
        res.sendFile(path.join(_prRoot, file));
    });
});

// Serve static files AFTER API routes (so /api/* is handled first)
app.use(express.static(path.join(__dirname)));

// Export the Express app for Vercel serverless deployment
module.exports = app;

// Start server locally if not being required as a module
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    const server = app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
        console.log(`Open http://localhost:${PORT}/personal-relationship-read`);
        console.log(
            'If checkout fails with "Invalid purchase type" or /api/stripe-client-config 404s, another app is using this port — stop it, then run node server.js again from this project root (where .env lives).'
        );
    });
    server.on('error', (err) => {
        if (err && err.code === 'EADDRINUSE') {
            console.error(
                `Port ${PORT} is already in use. Stop the other process (e.g. lsof -i :${PORT}) and restart, or run PORT=3001 node server.js`
            );
        } else {
            console.error(err);
        }
        process.exit(1);
    });
}
