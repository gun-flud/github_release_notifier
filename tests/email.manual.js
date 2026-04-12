// tests/email.manual.js
// Manual test — sends real emails to Mailhog so you can see them visually
//
// Before running:
//   docker run -d --name mailhog -p 1025:1025 -p 8025:8025 mailhog/mailhog
//
// Run:
//   node tests/email.manual.js
//
// Then open: http://localhost:8025

import 'dotenv/config';
import {
  sendConfirmationEmail,
  sendReleaseNotificationEmail,
} from '../src/services/email/emailService.js';

const TEST_EMAIL = 'test@example.com';

// ─── Test 1: Confirmation email ───────────────────────────────
console.log('--- Confirmation email ---');
try {
  await sendConfirmationEmail(
    TEST_EMAIL,
    'golang/go',
    'fake-confirm-token-abc123'
  );
  console.log('1 Confirmation email sent');
} catch (err) {
  console.error('0 Failed:', err.message);
}

// ─── Test 2: Release notification with notes ──────────────────
console.log('\n--- Release notification (with notes) ---');
try {
  await sendReleaseNotificationEmail(
    TEST_EMAIL,
    'alskdjflkajsdf',
    'golang/go',
    'v1.22.4',
    'https://github.com/golang/go/releases/tag/go1.22.4',
  );

  console.log('1 Release notification sent');
} catch (err) {
  console.error('0 Failed:', err.message);
}

// ─── Test 3: Release notification WITHOUT notes ───────────────
console.log('\n--- Release notification (no notes) ---');
try {
  await sendReleaseNotificationEmail(
    TEST_EMAIL,
    'alskdj.kasdf8484',
    'facebook/react',
    'v18.3.0',
    'https://github.com/facebook/react/releases/tag/v18.3.0',
  );
  console.log('1 Release notification (no notes) sent');
} catch (err) {
  console.error('0 Failed:', err.message);
}

// ─── Summary ──────────────────────────────────────────────────
console.log('\nOpen http://localhost:8025 — you should see 3 emails.');
console.log('Check:');
console.log('  1 Confirmation email has a green "Confirm Subscription" button');
console.log('  1 Release email shows tag name and "View on GitHub" button');
console.log('  1 Release email with no notes shows fallback text');