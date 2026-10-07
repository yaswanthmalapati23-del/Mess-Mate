import {
  isAllowedCollegeEmail,
  getAllowedCollegeDomains,
  signInStudentWithPassword,
  setStudentPassword,
  sendPasswordResetEmail,
  verifyCollegeOtp,
} from '../lib/supabaseClient';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${testName}`);
    failed++;
  }
}

async function runTests() {
  console.log('\n======================================================');
  console.log('🧪 MESS MATE AUTH & PASSWORD LOGIC TEST SUITE');
  console.log('======================================================\n');

  // Test 1: Allowed domains list
  const domains = getAllowedCollegeDomains();
  assert(domains.includes('vitapstudent.ac.in'), 'Includes default vitapstudent.ac.in domain');
  assert(domains.includes('vitap.ac.in'), 'Includes default vitap.ac.in domain');

  // Test 2: Domain validation for sign-up & login
  assert(isAllowedCollegeEmail('21bce1001@vitapstudent.ac.in').valid, 'Valid student email accepted');
  assert(isAllowedCollegeEmail('arjun.v@vitap.ac.in').valid, 'Valid faculty/admin college email accepted');
  assert(!isAllowedCollegeEmail('student@gmail.com').valid, 'Gmail rejected');
  assert(!isAllowedCollegeEmail('hacker@vitapstudent.ac.in.attacker.com').valid, 'Phishing subdomain rejected');

  // Test 3: Password validation
  const weakPasswordResult = await setStudentPassword('short');
  assert(!weakPasswordResult.success, 'Rejects password shorter than 8 characters');
  assert(
    weakPasswordResult.error?.includes('8 characters') || false,
    'Error message specifies 8 characters minimum'
  );

  const validPasswordResult = await setStudentPassword('StrongPass123!');
  assert(validPasswordResult.success, 'Accepts password >= 8 characters');

  // Test 4: Password login validation
  const emptyPassResult = await signInStudentWithPassword('21bce1001@vitapstudent.ac.in', '');
  assert(!emptyPassResult.success, 'Rejects empty password for login');

  const invalidDomainLogin = await signInStudentWithPassword('user@yahoo.com', 'password123');
  assert(!invalidDomainLogin.success, 'Rejects login from unauthorized email domain');

  // Test 5: Forgot Password email validation
  const invalidReset = await sendPasswordResetEmail('attacker@gmail.com');
  assert(!invalidReset.success, 'Rejects password reset for non-college email');

  const validReset = await sendPasswordResetEmail('21bce1001@vitapstudent.ac.in');
  assert(validReset.success, 'Accepts password reset for valid college email');

  // Test 6: 6-digit and 8-digit OTP code support
  const otp6 = await verifyCollegeOtp('21bce1001@vitapstudent.ac.in', '123456');
  assert(otp6.success, 'Accepts 6-digit OTP code');

  const otp8 = await verifyCollegeOtp('21bce1001@vitapstudent.ac.in', '12345678');
  assert(otp8.success, 'Accepts 8-digit OTP code');

  const otpInvalid = await verifyCollegeOtp('21bce1001@vitapstudent.ac.in', '123');
  assert(!otpInvalid.success, 'Rejects invalid short code (< 6 digits)');

  console.log('\n------------------------------------------------------');
  console.log(`Results: ${passed} passed, ${failed} failed.`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
