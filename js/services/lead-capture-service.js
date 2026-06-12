/**
 * Bio / Let It Out lead capture — Firestore bioMessages + Google Form "Message Me" sheet.
 * Same pipeline as liamsaysit.html Message Me form.
 */
(function (g) {
    const FORM_ACTION =
        'https://docs.google.com/forms/d/e/1FAIpQLSfyNFXWb8mZ0A-EOemynRlZemc1_Pm1fvYvl5O9DKqpfwjAAw/formResponse';
    const ENTRY_MESSAGE = 'entry.1072301583';
    const ENTRY_EMAIL = 'entry.2011616989';
    const IFRAME_NAME = 'lead-capture-iframe';

    const CONNECT_ONE_ON_ONE_MESSAGE = 'Let It Out — Connect with me 1 on 1';
    const PERSPECTIVE_BANNER_MESSAGE = 'Let It Out banner — want perspective';

    const SUPPORT_EMAIL = 'resetmypattern@gmail.com';
    const LEAD_SUBMIT_TTL_MS = 30 * 24 * 60 * 60 * 1000;
    const LEAD_STORAGE_KEYS = {
        perspective: 'letitout_perspective_lead_submitted',
        connect: 'letitout_connect_lead_submitted',
    };

    function normalizeLeadEmail(email) {
        return (email || '').trim().toLowerCase();
    }

    function leadStorageKeyForEmail(baseKey, email) {
        const normalized = normalizeLeadEmail(email);
        if (!baseKey || !normalized) return baseKey || '';
        return `${baseKey}:${normalized}`;
    }

    function markLeadSubmitted(storageKey, email) {
        const key = leadStorageKeyForEmail(storageKey, email);
        if (!key) return;
        try {
            localStorage.setItem(key, String(Date.now()));
        } catch (_) {
            /* ignore */
        }
    }

    function hasRecentLeadSubmission(storageKey, email) {
        const key = leadStorageKeyForEmail(storageKey, email);
        if (!key || !normalizeLeadEmail(email)) return false;
        try {
            const raw = localStorage.getItem(key);
            if (!raw) return false;
            const ts = Number(raw);
            if (!Number.isFinite(ts)) {
                localStorage.removeItem(key);
                return false;
            }
            return Date.now() - ts < LEAD_SUBMIT_TTL_MS;
        } catch (_) {
            return false;
        }
    }

    function showLeadSubmitError(
        message = `Something went wrong. Please try again or email ${SUPPORT_EMAIL}.`
    ) {
        if (window.LetItOutUtils?.showError) {
            window.LetItOutUtils.showError(message);
            return;
        }
        alert(message);
    }

    function ensureHiddenIframe() {
        let iframe = document.getElementById('lead-capture-iframe');
        if (!iframe) {
            iframe = document.createElement('iframe');
            iframe.name = IFRAME_NAME;
            iframe.id = 'lead-capture-iframe';
            iframe.title = 'Form submit';
            iframe.setAttribute('aria-hidden', 'true');
            iframe.style.cssText = 'display:none;width:0;height:0;border:0;';
            document.body.appendChild(iframe);
        }
        return iframe;
    }

    function postToGoogleForm(message, email) {
        if (!FORM_ACTION || !ENTRY_MESSAGE) return;
        ensureHiddenIframe();

        const form = document.createElement('form');
        form.setAttribute('method', 'POST');
        form.setAttribute('action', FORM_ACTION);
        form.setAttribute('target', IFRAME_NAME);
        form.setAttribute('accept-charset', 'UTF-8');
        form.style.cssText = 'position:absolute;left:-9999px;opacity:0;pointer-events:none;';

        const msg = document.createElement('input');
        msg.setAttribute('type', 'hidden');
        msg.setAttribute('name', ENTRY_MESSAGE);
        msg.setAttribute('value', message);
        form.appendChild(msg);

        if (ENTRY_EMAIL) {
            const em = document.createElement('input');
            em.setAttribute('type', 'hidden');
            em.setAttribute('name', ENTRY_EMAIL);
            em.setAttribute('value', email || '');
            form.appendChild(em);
        }

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    }

    function getDb() {
        if (typeof g.letitoutDb !== 'undefined' && g.letitoutDb) {
            return g.letitoutDb;
        }
        if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length) {
            return firebase.firestore();
        }
        return null;
    }

    async function ensureAnonymousAuth() {
        if (typeof firebase === 'undefined' || !firebase.auth) {
            throw new Error('Firebase auth unavailable');
        }
        const auth = firebase.auth();
        if (auth.currentUser) {
            await auth.currentUser.getIdToken(true);
            return auth.currentUser;
        }
        await auth.signInAnonymously();
        const user = auth.currentUser;
        if (!user) throw new Error('Anonymous auth failed');
        await user.getIdToken(true);
        return user;
    }

    /**
     * @param {{ email: string, message: string, source?: 'liamsaysit'|'letitout' }} payload
     */
    async function submitBioLead(payload) {
        const email = (payload.email || '').trim();
        const message = (payload.message || '').trim();
        const source = payload.source === 'liamsaysit' ? 'liamsaysit' : 'letitout';

        if (!email || email.length < 5 || email.length > 320) {
            throw new Error('invalid_email');
        }
        if (!message || message.length < 3 || message.length > 5000) {
            throw new Error('invalid_message');
        }

        const db = getDb();
        if (db) {
            await ensureAnonymousAuth();
            await db.collection('bioMessages').add({
                message,
                email,
                source,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            });
        } else {
            console.warn('LeadCaptureService: Firestore unavailable — Google Form sync only');
        }

        postToGoogleForm(message, email);
    }

    async function submitConnectOneOnOne(email) {
        return submitBioLead({
            email,
            message: CONNECT_ONE_ON_ONE_MESSAGE,
            source: 'letitout',
        });
    }

    async function submitPerspectiveBanner(email) {
        return submitBioLead({
            email,
            message: PERSPECTIVE_BANNER_MESSAGE,
            source: 'letitout',
        });
    }

    g.LeadCaptureService = {
        submitBioLead,
        submitConnectOneOnOne,
        submitPerspectiveBanner,
        markLeadSubmitted,
        hasRecentLeadSubmission,
        showLeadSubmitError,
        SUPPORT_EMAIL,
        LEAD_STORAGE_KEYS,
        CONNECT_ONE_ON_ONE_MESSAGE,
        PERSPECTIVE_BANNER_MESSAGE,
    };
})(typeof globalThis !== 'undefined' ? globalThis : window);
