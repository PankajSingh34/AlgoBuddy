const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const helperPath = path.resolve(__dirname, "..", "src", "lib", "profileLookup.js");
const githubReposRoutePath = path.resolve(__dirname, "..", "src", "app", "api", "github-repos", "route.js");
const codingProfilesRoutePath = path.resolve(__dirname, "..", "src", "app", "api", "coding-profiles", "fetch", "route.js");

test("Profile lookup endpoints are rate-limited and validate usernames", async (t) => {
  const {
    isValidProfileLookupUsername,
    getProfileLookupRateLimitKey,
    normalizeProfileLookupPlatform,
  } = await import(`file://${helperPath}`);

  await t.test("normalizes platform names before validation", () => {
    assert.equal(normalizeProfileLookupPlatform(" GitHub "), "github");
    assert.equal(normalizeProfileLookupPlatform("LeetCode"), "leetcode");
  });

  await t.test("validates GitHub usernames conservatively", () => {
    assert.equal(isValidProfileLookupUsername("github", "saurabhhhcodes"), true);
    assert.equal(isValidProfileLookupUsername("github", "a"), true);
    assert.equal(isValidProfileLookupUsername("github", "this-is-not-a-valid-user-"), false);
    assert.equal(isValidProfileLookupUsername("github", "bad/name"), false);
  });

  await t.test("validates platform-specific usernames", () => {
    assert.equal(isValidProfileLookupUsername("leetcode", "shruti_123"), true);
    assert.equal(isValidProfileLookupUsername("codeforces", "tourist"), true);
    assert.equal(isValidProfileLookupUsername("codechef", "coder_01"), true);
    assert.equal(isValidProfileLookupUsername("leetcode", "x"), false);
    assert.equal(isValidProfileLookupUsername("codechef", "1coder"), false);
  });

  await t.test("builds endpoint-scoped rate-limit keys", () => {
    assert.equal(getProfileLookupRateLimitKey("github-repos", "127.0.0.1"), "profile-lookup:github-repos:127.0.0.1");
    assert.equal(getProfileLookupRateLimitKey("leetcode", null), "profile-lookup:leetcode:unknown");
  });

  await t.test("routes import the shared throttle helpers", () => {
    const githubRepos = fs.readFileSync(githubReposRoutePath, "utf8");
    const codingProfiles = fs.readFileSync(codingProfilesRoutePath, "utf8");

    assert.match(githubRepos, /checkRateLimit/);
    assert.match(githubRepos, /getClientIp/);
    assert.match(githubRepos, /PROFILE_LOOKUP_API/);
    assert.match(githubRepos, /getProfileLookupRateLimitKey/);
    assert.match(githubRepos, /isValidProfileLookupUsername/);

    assert.match(codingProfiles, /checkRateLimit/);
    assert.match(codingProfiles, /getClientIp/);
    assert.match(codingProfiles, /PROFILE_LOOKUP_API/);
    assert.match(codingProfiles, /getProfileLookupRateLimitKey/);
    assert.match(codingProfiles, /isValidProfileLookupUsername/);
  });
});
