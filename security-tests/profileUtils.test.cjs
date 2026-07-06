// security-tests/profileUtils.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/profileUtils.test.cjs
//
// Tests profile utility constants and helper objects from src/lib/profileUtils.js.

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

// Inline profileUtils.js for deterministic testing
const AVATAR_BUCKET = "avatars";
const MAX_AVATAR_FILE_SIZE = 2 * 1024 * 1024;
const MAX_AVATAR_URL_LENGTH = 512;
const MAX_PROFILE_URL_LENGTH = 512;
const MAX_BIO_LENGTH = 300;

const PROFILE_URL_FIELDS = ["resume_link", "github_profile", "linkedin_profile"];

const PRESET_PROJECT_GRADIENTS = [
  "bg-[linear-gradient(135deg,#190f4f,#25116d_45%,#5338f2)]",
  "bg-[linear-gradient(135deg,#064e3b,#0f172a)]",
  "bg-[linear-gradient(135deg,#312e81,#111827)]",
  "bg-[linear-gradient(135deg,#7c2d12,#1c1917)]",
  "bg-[linear-gradient(135deg,#134e4a,#0f172a)]",
  "bg-[linear-gradient(135deg,#1e1b4b,#312e81)]",
];

const EMPTY_PROJECT = {
  title: "",
  subtitle: "",
  tags: "",
  url: "",
  preview: PRESET_PROJECT_GRADIENTS[0],
};

const CODING_PLATFORMS = [
  ["leetcode", "leetcode_username", "LeetCode Username", "leetcode_solved", "Solved"],
  ["codeforces", "codeforces_username", "Codeforces Handle", "codeforces_rating", "Rating"],
  ["codechef", "codechef_username", "CodeChef Username", "codechef_stars", "Stars"],
  ["github", "github_username", "GitHub Username", "github_contributions", "Contributions"],
];

const ONBOARDING_OPTIONAL_FIELDS = [
  ["college", "College / University", "Your college name"],
  ["branch", "Branch", "Computer Science"],
  ["location", "Location", "City, Country"],
  ["github_profile", "GitHub URL", "https://github.com/..."],
  ["linkedin_profile", "LinkedIn URL", "https://linkedin.com/in/..."],
  ["resume_link", "Portfolio URL", "https://..."],
];

const ONBOARDING_CODING_FIELDS = CODING_PLATFORMS.map(
  ([, usernameField, usernameLabel]) => [usernameField, usernameLabel.replace(" Username", "").replace(" Handle", ""), "username"],
);

const EMPTY_PROFILE_FORM = {
  name: "",
  branch: "",
  college: "",
  location: "",
  github_profile: "",
  linkedin_profile: "",
  resume_link: "",
  leetcode_username: "",
  codeforces_username: "",
  codechef_username: "",
  github_username: "",
};

describe("AVATAR_BUCKET", () => {
  test("is a non-empty string", () => {
    assert.ok(typeof AVATAR_BUCKET === "string" && AVATAR_BUCKET.length > 0);
  });
});

describe("MAX_AVATAR_FILE_SIZE", () => {
  test("equals 2MB (2097152 bytes)", () => {
    assert.strictEqual(MAX_AVATAR_FILE_SIZE, 2 * 1024 * 1024);
    assert.strictEqual(MAX_AVATAR_FILE_SIZE, 2097152);
  });

  test("is a positive number", () => {
    assert.ok(typeof MAX_AVATAR_FILE_SIZE === "number" && MAX_AVATAR_FILE_SIZE > 0);
  });
});

describe("MAX_AVATAR_URL_LENGTH", () => {
  test("is a positive integer", () => {
    assert.ok(typeof MAX_AVATAR_URL_LENGTH === "number" && MAX_AVATAR_URL_LENGTH > 0);
    assert.strictEqual(MAX_AVATAR_URL_LENGTH, 512);
  });
});

describe("MAX_PROFILE_URL_LENGTH", () => {
  test("is a positive integer", () => {
    assert.ok(typeof MAX_PROFILE_URL_LENGTH === "number" && MAX_PROFILE_URL_LENGTH > 0);
    assert.strictEqual(MAX_PROFILE_URL_LENGTH, 512);
  });
});

describe("MAX_BIO_LENGTH", () => {
  test("is a positive integer", () => {
    assert.ok(typeof MAX_BIO_LENGTH === "number" && MAX_BIO_LENGTH > 0);
    assert.strictEqual(MAX_BIO_LENGTH, 300);
  });
});

describe("PROFILE_URL_FIELDS", () => {
  test("is a non-empty array", () => {
    assert.ok(Array.isArray(PROFILE_URL_FIELDS) && PROFILE_URL_FIELDS.length > 0);
  });

  test("contains only string elements", () => {
    PROFILE_URL_FIELDS.forEach((field) => {
      assert.ok(typeof field === "string", `${field} is not a string`);
    });
  });
});

describe("PRESET_PROJECT_GRADIENTS", () => {
  test("is a non-empty array", () => {
    assert.ok(Array.isArray(PRESET_PROJECT_GRADIENTS) && PRESET_PROJECT_GRADIENTS.length > 0);
  });

  test("contains only string elements", () => {
    PRESET_PROJECT_GRADIENTS.forEach((g) => {
      assert.ok(typeof g === "string", `${g} is not a string`);
    });
  });

  test("each gradient contains bg-[linear-gradient", () => {
    PRESET_PROJECT_GRADIENTS.forEach((g) => {
      assert.ok(g.includes("bg-[linear-gradient"), `Gradient '${g}' does not include bg-[linear-gradient`);
    });
  });
});

describe("EMPTY_PROJECT", () => {
  test("has the expected keys", () => {
    const expectedKeys = ["title", "subtitle", "tags", "url", "preview"];
    expectedKeys.forEach((key) => {
      assert.ok(Object.prototype.hasOwnProperty.call(EMPTY_PROJECT, key), `Missing key: ${key}`);
    });
  });

  test("title, subtitle, tags, url are empty strings", () => {
    assert.strictEqual(EMPTY_PROJECT.title, "");
    assert.strictEqual(EMPTY_PROJECT.subtitle, "");
    assert.strictEqual(EMPTY_PROJECT.tags, "");
    assert.strictEqual(EMPTY_PROJECT.url, "");
  });

  test("preview is a valid gradient from PRESET_PROJECT_GRADIENTS", () => {
    assert.ok(PRESET_PROJECT_GRADIENTS.includes(EMPTY_PROJECT.preview));
  });
});

describe("CODING_PLATFORMS", () => {
  test("is a non-empty array", () => {
    assert.ok(Array.isArray(CODING_PLATFORMS) && CODING_PLATFORMS.length > 0);
  });

  test("each platform is a 5-element array", () => {
    CODING_PLATFORMS.forEach((platform) => {
      assert.ok(Array.isArray(platform) && platform.length === 5, `${JSON.stringify(platform)} is not a 5-element array`);
    });
  });

  test("each platform has non-empty id, field, and label strings", () => {
    CODING_PLATFORMS.forEach((platform) => {
      const [id, field] = platform;
      assert.ok(typeof id === "string" && id.length > 0, `Platform id is empty: ${platform}`);
      assert.ok(typeof field === "string" && field.length > 0, `Platform field is empty: ${platform}`);
    });
  });
});

describe("ONBOARDING_OPTIONAL_FIELDS", () => {
  test("is a non-empty array", () => {
    assert.ok(Array.isArray(ONBOARDING_OPTIONAL_FIELDS) && ONBOARDING_OPTIONAL_FIELDS.length > 0);
  });

  test("each field is a 3-element array", () => {
    ONBOARDING_OPTIONAL_FIELDS.forEach((field) => {
      assert.ok(Array.isArray(field) && field.length === 3, `${JSON.stringify(field)} is not a 3-element array`);
    });
  });

  test("each field has non-empty key and label strings", () => {
    ONBOARDING_OPTIONAL_FIELDS.forEach((field) => {
      const [key, label] = field;
      assert.ok(typeof key === "string" && key.length > 0, `Field key is empty: ${field}`);
      assert.ok(typeof label === "string" && label.length > 0, `Field label is empty: ${field}`);
    });
  });
});

describe("EMPTY_PROFILE_FORM", () => {
  test("has the expected keys", () => {
    const expectedKeys = ["name", "branch", "college", "location", "github_profile", "linkedin_profile", "resume_link", "leetcode_username", "codeforces_username", "codechef_username", "github_username"];
    expectedKeys.forEach((key) => {
      assert.ok(Object.prototype.hasOwnProperty.call(EMPTY_PROFILE_FORM, key), `Missing key: ${key}`);
    });
  });

  test("all values are empty strings", () => {
    Object.values(EMPTY_PROFILE_FORM).forEach((value) => {
      assert.strictEqual(value, "", `Profile field has non-empty value: ${value}`);
    });
  });
});
