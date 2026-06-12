import { checkGlobalSmtpQuota, resetAll } from "../src/lib/rateLimit/index.js";
import assert from "assert";

async function runSmtpQuotaTest() {
  console.log("--- Running SMTP Quota Verification Test ---");

  // Reset any state
  await resetAll();

  // Test with quota limit of 3
  const quotaLimit = 3;

  // 1st request
  const r1 = await checkGlobalSmtpQuota(quotaLimit);
  console.log("Req 1 (expected allowed=true):", r1);
  assert.strictEqual(r1.allowed, true);
  assert.strictEqual(r1.remaining, 2);

  // 2nd request
  const r2 = await checkGlobalSmtpQuota(quotaLimit);
  console.log("Req 2 (expected allowed=true):", r2);
  assert.strictEqual(r2.allowed, true);
  assert.strictEqual(r2.remaining, 1);

  // 3rd request
  const r3 = await checkGlobalSmtpQuota(quotaLimit);
  console.log("Req 3 (expected allowed=true):", r3);
  assert.strictEqual(r3.allowed, true);
  assert.strictEqual(r3.remaining, 0);

  // 4th request (exceeds limit!)
  const r4 = await checkGlobalSmtpQuota(quotaLimit);
  console.log("Req 4 (expected allowed=false):", r4);
  assert.strictEqual(r4.allowed, false);
  assert.strictEqual(r4.remaining, 0);

  console.log("All SMTP quota assertions PASSED successfully!");
}

runSmtpQuotaTest().catch((err) => {
  console.error("SMTP Quota verification FAILED:", err);
  process.exit(1);
});
