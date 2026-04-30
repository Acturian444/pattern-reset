/**
 * Quiz Google Sheet mirror — sends payloads to `/api/quiz-google-form-sync` only.
 * Form URLs and Google entry IDs stay on the server (server.js).
 *
 * Firestore remains source of truth for quiz state; Sheets are for ops triage.
 */
(function () {
    'use strict';

    /** Same-origin API path — requires deployed server.js (local: run `npm start`). */
    var SYNC_PATH = '/api/quiz-google-form-sync';

    function guessSyncUrl() {
        try {
            if (typeof window !== 'undefined' && window.location && window.location.origin && window.location.origin !== 'null') {
                var base = window.location.origin.replace(/\/$/, '');
                return base + SYNC_PATH;
            }
        } catch (e) {}
        return SYNC_PATH;
    }

    function attachAppCheckHeaders(headers) {
        headers = headers || {};
        try {
            if (typeof firebase !== 'undefined' && firebase.appCheck && typeof firebase.appCheck === 'function') {
                var ac = firebase.appCheck();
                return ac.getToken(false).then(function (result) {
                    if (result && result.token) {
                        headers['X-Firebase-AppCheck'] = result.token;
                    }
                    return headers;
                }).catch(function () {
                    return headers;
                });
            }
        } catch (e) {}
        return Promise.resolve(headers);
    }

    /**
     * Fire-and-forget quiz snapshot sync (Sheet mirror).
     */
    async function submitQuizSnapshotToGoogleFormRelay(data) {
        if (!data || typeof data !== 'object') return;

        var headers = { 'Content-Type': 'application/json' };
        headers = await attachAppCheckHeaders(headers);

        var res = await fetch(guessSyncUrl(), {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data),
            credentials: 'same-origin',
            keepalive: true,
        });

        if (!res.ok) {
            var errText = '';
            try {
                errText = await res.text();
            } catch (e) {}
            throw new Error('quiz form sync ' + res.status + (errText ? ' ' + errText.slice(0, 200) : ''));
        }
    }

    function submit(data) {
        submitQuizSnapshotToGoogleFormRelay(data).catch(function (err) {
            console.warn('submitQuizSnapshotToGoogleForm failed', err.message);
        });
    }

    window.submitQuizSnapshotToGoogleForm = submit;
})();
