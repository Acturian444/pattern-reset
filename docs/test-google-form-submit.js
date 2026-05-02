#!/usr/bin/env node
/**
 * Test script: Submit directly to Google Form to verify it works.
 * Run: node docs/test-google-form-submit.js
 * If a row appears in your sheet, the form accepts submissions. If not, the issue is with the form/settings.
 */

const FORM_ID = '1FAIpQLSeh3-Du0MCwiR_2LFEei7B0Zb4j1awjVZmcv53Mcvh8-HU8tA';
const ENTRIES = {
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

const testData = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  phone: '555-0000',  // Form may require phone
  city: 'San Jose',
  ageRange: '25-34',
  instagram: '@test',
  clubs: 'saturday-social-walk',
  lifeStage: 'new-to-area',
  availability: 'weekends',
  relationshipStatus: 'single',
  whyJoin: 'Testing form submission',
  eventInterest: 'saturday-social-walk',
  attendPreference: 'comfortable-solo',
  guidelinesAgreed: 'Yes',
  contactShareConsent: 'No',
};

async function test() {
  const params = new URLSearchParams();
  const add = (key, val) => {
    if (key) params.append(key, val == null ? '' : String(val));
  };
  add(ENTRIES.firstName, testData.firstName);
  add(ENTRIES.lastName, testData.lastName);
  add(ENTRIES.email, testData.email);
  add(ENTRIES.phone, testData.phone);
  add(ENTRIES.city, testData.city);
  add(ENTRIES.ageRange, testData.ageRange);
  add(ENTRIES.instagram, testData.instagram);
  add(ENTRIES.clubs, testData.clubs);
  add(ENTRIES.lifeStage, testData.lifeStage);
  add(ENTRIES.availability, testData.availability);
  add(ENTRIES.relationshipStatus, testData.relationshipStatus);
  add(ENTRIES.whyJoin, testData.whyJoin);
  add(ENTRIES.eventInterest, testData.eventInterest);
  add(ENTRIES.attendPreference, testData.attendPreference);
  add(ENTRIES.guidelinesAgreed, testData.guidelinesAgreed);
  add(ENTRIES.contactShareConsent, testData.contactShareConsent);

  const url = `https://docs.google.com/forms/d/e/${FORM_ID}/formResponse`;
  console.log('Submitting to:', url);
  console.log('Params:', params.toString().slice(0, 200) + '...');

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Origin': 'https://docs.google.com',
      'Referer': `https://docs.google.com/forms/d/e/${FORM_ID}/viewform`,
    },
    body: params.toString(),
  });

  console.log('Status:', res.status, res.statusText);
  const text = await res.text();
  console.log('Response length:', text.length);
  if (text.includes('Your response has been recorded') || res.status === 200) {
    console.log('\n✅ SUCCESS: Form accepted the submission. Check your Google Sheet for a new row.');
  } else {
    console.log('\n❌ Response may indicate failure. Check your form settings.');
    console.log('First 500 chars:', text.slice(0, 500));
  }
}

test().catch((e) => {
  console.error('Error:', e);
  process.exit(1);
});
