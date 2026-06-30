// security-tests/avatar-upload-allowlist.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/avatar-upload-allowlist.test.cjs
//
// Tests the avatar upload allowlist in src/lib/avatarUpload.js.

const { describe, test, before } = require("node:test");
const assert = require("node:assert/strict");
const { pathToFileURL } = require("node:url");
const { resolve } = require("node:path");

let isAllowedAvatarFile;

before(async () => {
  ({ isAllowedAvatarFile } = await import(
    pathToFileURL(resolve(__dirname, "../src/lib/avatarUpload.js")).href
  ));
});

describe("isAllowedAvatarFile", () => {
  test("allows JPG avatars", () => {
    assert.strictEqual(
      isAllowedAvatarFile({ name: "avatar.JPG", type: "image/jpeg" }),
      true
    );
  });

  test("allows PNG avatars", () => {
    assert.strictEqual(
      isAllowedAvatarFile({ name: "profile.png", type: "image/png" }),
      true
    );
  });

  test("allows WebP avatars", () => {
    assert.strictEqual(
      isAllowedAvatarFile({ name: "profile-picture.webp", type: "image/webp" }),
      true
    );
  });

  test("rejects SVG files", () => {
    assert.strictEqual(
      isAllowedAvatarFile({ name: "avatar.svg", type: "image/svg+xml" }),
      false
    );
  });

  test("rejects image subtypes that are not allowlisted", () => {
    assert.strictEqual(
      isAllowedAvatarFile({ name: "avatar.gif", type: "image/gif" }),
      false
    );
  });

  test("rejects MIME and extension mismatches", () => {
    assert.strictEqual(
      isAllowedAvatarFile({ name: "avatar.png", type: "image/jpeg" }),
      false
    );
    assert.strictEqual(
      isAllowedAvatarFile({ name: "avatar.jpg", type: "image/png" }),
      false
    );
  });

  test("rejects files without a usable extension", () => {
    assert.strictEqual(
      isAllowedAvatarFile({ name: "avatar", type: "image/png" }),
      false
    );
  });
});
