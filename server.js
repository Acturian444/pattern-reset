require('dotenv').config();
const express = require('express');
const path = require('path');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_YOUR_STRIPE_SECRET_KEY');
const app = express();

// Parse JSON bodies (must be before routes that need it)
app.use(express.json());

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
        } else {
            // Fallback: legacy custom price (should not be used anymore)
            res.status(400).json({ error: 'Invalid purchase type or missing priceId.' });
            return;
        }

        const session = await stripe.checkout.sessions.create(sessionConfig);

        res.json({ id: session.id });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: 'Failed to create checkout session' });
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
            res.json({ 
                verified: true, 
                course: 'breakup_reset',
                message: 'Payment verified successfully' 
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

// Serve static files AFTER API routes (so /api/* is handled first)
app.use(express.static(path.join(__dirname)));

// Export the Express app for Vercel serverless deployment
module.exports = app;

// Start server locally if not being required as a module
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
        console.log(`Preview your site at http://localhost:${PORT}`);
    });
}
