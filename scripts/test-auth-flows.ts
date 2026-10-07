import {
  isAllowedCollegeEmail,
  registerStudentWithPassword,
  signInStudentWithPassword,
} from '../lib/supabaseClient';

async function testAuth() {
  console.log('--- 1. Testing College Email Validation ---');
  const validCollege = isAllowedCollegeEmail('yaswanth.26bce7370@vitapstudent.ac.in');
  console.log('Valid college email:', validCollege);
  if (!validCollege.valid || !validCollege.isCollegeDomain) throw new Error('Failed college email validation');

  const invalidEmail = isAllowedCollegeEmail('notanemail');
  console.log('Invalid email:', invalidEmail);
  if (invalidEmail.valid) throw new Error('Malformed email should be rejected');

  console.log('\n--- 2. Testing New Student Registration ---');
  const testEmail = 'yaswanth.26bce7370@vitapstudent.ac.in';
  const testPass = 'YaswanthSecure123';

  const regRes = await registerStudentWithPassword(testEmail, testPass);
  console.log('Registration Result:', regRes);
  if (!regRes.success || !regRes.student) {
    throw new Error('Student registration failed');
  }

  console.log('\n--- 3. Testing Duplicate Registration Prevention ---');
  const dupRes = await registerStudentWithPassword(testEmail, testPass);
  console.log('Duplicate Registration Result:', dupRes);
  if (dupRes.success) throw new Error('Duplicate registration should have been prevented');

  console.log('\n--- 4. Testing Password Sign In with Wrong Password ---');
  const wrongLoginRes = await signInStudentWithPassword(testEmail, 'wrongpass');
  console.log('Wrong login response:', wrongLoginRes);
  if (wrongLoginRes.success) throw new Error('Wrong password should be rejected');

  console.log('\n--- 5. Testing Password Sign In with Correct Password ---');
  const correctLoginRes = await signInStudentWithPassword(testEmail, testPass);
  console.log('Correct login response:', correctLoginRes);
  if (!correctLoginRes.success || !correctLoginRes.student) throw new Error('Correct password sign in failed');

  console.log('\n========================================');
  console.log('ALL REGISTRATION & LOGIN TESTS PASSED!');
  console.log('========================================');
}

testAuth().catch((err) => {
  console.error('TEST ERROR:', err);
  process.exit(1);
});
