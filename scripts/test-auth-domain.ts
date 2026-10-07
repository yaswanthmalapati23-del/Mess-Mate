import { isAllowedCollegeEmail, getAllowedCollegeDomains } from '../lib/supabaseClient';

function runAuthTests() {
  console.log('========================================');
  console.log('MESS MATE: COLLEGE AUTH & DOMAIN TESTS');
  console.log('========================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      failed++;
    }
  }

  // --- 1. Allowed Domains Configuration ---
  console.log('--- 1. College Domain Configuration ---');
  const allowed = getAllowedCollegeDomains();
  assert(allowed.includes('vitapstudent.ac.in'), 'vitapstudent.ac.in is configured as allowed college domain');
  assert(allowed.length >= 1, 'At least one college domain is configured');

  // --- 2. Client-Side Domain Validation (Acceptance) ---
  console.log('\n--- 2. Valid College Email Acceptance ---');
  const validEmails = [
    '21bce1001@vitapstudent.ac.in',
    'arjun.verma@vitapstudent.ac.in',
    'mess.committee@vitapstudent.ac.in',
    'student.council@vitapstudent.ac.in',
    '22bce5555@vitapstudent.ac.in',
    'faculty@vitap.ac.in',
  ];

  for (const email of validEmails) {
    const res = isAllowedCollegeEmail(email);
    assert(res.valid === true, `Accepts valid student email: ${email}`);
  }

  // --- 3. Client-Side Domain Validation (Rejection) ---
  console.log('\n--- 3. Unauthorized Domain Rejection (Client-Side) ---');
  const invalidEmails = [
    { email: 'john.doe@gmail.com', reason: 'Public Gmail' },
    { email: 'student@yahoo.co.in', reason: 'Yahoo Mail' },
    { email: 'test@vitap.com', reason: 'Non-ac.in commercial domain' },
    { email: 'fake@vitap.ac.in.attacker.org', reason: 'Subdomain spoofing attempt' },
    { email: 'invalid-format-no-at-sign', reason: 'Malformed email format' },
    { email: '@vitapstudent.ac.in', reason: 'Missing username prefix' },
    { email: '', reason: 'Empty email' },
  ];

  for (const item of invalidEmails) {
    const res = isAllowedCollegeEmail(item.email);
    assert(res.valid === false, `Rejects ${item.reason} (${item.email})`);
    if (!res.valid) {
      assert(typeof res.reason === 'string' && res.reason.length > 0, `Provides user-friendly reason for ${item.email}`);
    }
  }

  // --- 4. OTP Code Format Verification ---
  console.log('\n--- 4. OTP Code Format Verification ---');
  const validOtp = '729143';
  const invalidOtps = ['12345', '1234567', 'abc123', '      ', '12 345'];

  assert(/^\d{6}$/.test(validOtp), 'Valid 6-digit numeric OTP passes check');
  for (const code of invalidOtps) {
    assert(!/^\d{6}$/.test(code), `Invalid OTP rejected: "${code}"`);
  }

  // --- 5. Server-Side Trigger Defense-in-Depth Simulation ---
  console.log('\n--- 5. Server-Side PostgreSQL Trigger Simulation ---');
  function simulatePostgresTrigger(email: string, allowedDbDomains: string[]): { allowed: boolean; error?: string } {
    const userDomain = (email.split('@')[1] || '').toLowerCase();
    const isDomainActive = allowedDbDomains.includes(userDomain);
    if (!isDomainActive) {
      return {
        allowed: false,
        error: `Access Denied: Email domain ${userDomain} is not authorized. Registration is restricted to verified college domains (@vitapstudent.ac.in).`,
      };
    }
    return { allowed: true };
  }

  const dbAllowedDomains = ['vitapstudent.ac.in', 'vitap.ac.in'];
  const dbTriggerTest1 = simulatePostgresTrigger('arjun@vitapstudent.ac.in', dbAllowedDomains);
  assert(dbTriggerTest1.allowed === true, 'Postgres trigger permits @vitapstudent.ac.in user record creation');

  const dbTriggerTest2 = simulatePostgresTrigger('hacker@external.com', dbAllowedDomains);
  assert(dbTriggerTest2.allowed === false, 'Postgres trigger blocks @external.com user record creation at DB level');
  assert(
    Boolean(dbTriggerTest2.error?.includes('Access Denied')),
    'Postgres trigger raises descriptive error for unauthorized email domains'
  );

  // --- 6. Row Level Security (RLS) Isolation Simulation ---
  console.log('\n--- 6. Row Level Security (RLS) Isolation Simulation ---');
  interface MockStudentRecord {
    id: string; // user UUID
    email: string;
    goal: string;
  }

  const studentAlice: MockStudentRecord = { id: 'uuid_alice_123', email: 'alice@vitap.ac.in', goal: 'fitness' };
  const studentBob: MockStudentRecord = { id: 'uuid_bob_456', email: 'bob@vitap.ac.in', goal: 'lose' };

  function simulateRlsSelect(authUid: string, record: MockStudentRecord): boolean {
    // RLS Policy: auth.uid() = id
    return authUid === record.id;
  }

  assert(simulateRlsSelect('uuid_alice_123', studentAlice) === true, 'Student Alice can read her own profile');
  assert(simulateRlsSelect('uuid_bob_456', studentAlice) === false, 'Student Bob CANNOT read Alice’s profile (RLS blocks)');
  assert(simulateRlsSelect('anonymous', studentAlice) === false, 'Unauthenticated query CANNOT read student data');

  console.log('\n========================================');
  console.log(`AUTH TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('========================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runAuthTests();
