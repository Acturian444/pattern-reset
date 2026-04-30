// Firebase configuration (Pattern Reset)
const firebaseConfig = {
    apiKey: "AIzaSyCOl9Q6qkC1Qwo0-2FTfQVnnohkrLpS7G0",
    authDomain: "pattern-reset.firebaseapp.com",
    projectId: "pattern-reset",
    storageBucket: "pattern-reset.firebasestorage.app",
    messagingSenderId: "700172951578",
    appId: "1:700172951578:web:a50cd168495c0da04b71a3",
    measurementId: "G-ZEZQRBTLR7"  // pattern-reset property @ analytics.google.com
};

/**
 * Optional: App Check (reCAPTCHA v3) **site key** from Firebase Console → App Check → Web.
 * Public; restrict by domain in Google Cloud. Leave empty until you register the web app there.
 * When set, firebase.js activates App Check; send `X-Firebase-AppCheck` from the client to your API.
 */
window.firebaseAppCheckSiteKey = '';

// Export for use in other modules
window.firebaseConfig = firebaseConfig;