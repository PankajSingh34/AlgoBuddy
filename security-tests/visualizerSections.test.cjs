// security-tests/visualizerSections.test.cjs
//
// Run with:  node --test security-tests/visualizerSections.test.cjs
//
// Tests src/lib/visualizerSections.js — sections array structural invariants.

const { describe, test } = require("node:test");
const assert = require("node:assert/strict");

const { sections } = require("../src/lib/visualizerSections");

// ── Basic shape ───────────────────────────────────────────────────────────────

test("sections is a non-empty array", () => {
  assert.ok(Array.isArray(sections), "sections should be an array");
  assert.ok(sections.length > 0, "sections should not be empty");
});

// ── Section fields ────────────────────────────────────────────────────────────

for (const section of sections) {
  test(`section "${section.title}" has non-empty title`, () => {
    assert.strictEqual(typeof section.title, "string");
    assert.ok(section.title.length > 0, "title should not be empty");
  });

  test(`section "${section.title}" has non-empty slug`, () => {
    assert.strictEqual(typeof section.slug, "string");
    assert.ok(section.slug.length > 0, "slug should not be empty");
  });

  test(`section "${section.title}" has non-empty desc`, () => {
    assert.strictEqual(typeof section.desc, "string");
    assert.ok(section.desc.length > 0, "desc should not be empty");
  });

  test(`section "${section.title}" has subsections as non-empty array`, () => {
    assert.ok(Array.isArray(section.subsections), "subsections should be an array");
    assert.ok(section.subsections.length > 0, "subsections should not be empty");
  });
}

// ── Subsection fields ─────────────────────────────────────────────────────────

for (const section of sections) {
  for (const subsection of section.subsections) {
    test(`subsection "${subsection.title}" in "${section.title}" has non-empty title`, () => {
      assert.strictEqual(typeof subsection.title, "string");
      assert.ok(subsection.title.length > 0, "subsection title should not be empty");
    });

    test(`subsection "${subsection.title}" in "${section.title}" has items as non-empty array`, () => {
      assert.ok(Array.isArray(subsection.items), "items should be an array");
      assert.ok(subsection.items.length > 0, "items should not be empty");
    });
  }
}

// ── Item fields ───────────────────────────────────────────────────────────────

for (const section of sections) {
  for (const subsection of section.subsections) {
    for (const item of subsection.items) {
      test(`item "${item.name}" in "${subsection.title}" has non-empty name`, () => {
        assert.strictEqual(typeof item.name, "string");
        assert.ok(item.name.length > 0, "item name should not be empty");
      });

      test(`item "${item.name}" in "${subsection.title}" has path starting with /visualizer/`, () => {
        assert.strictEqual(typeof item.path, "string");
        assert.ok(item.path.startsWith("/visualizer/"), `path should start with /visualizer/, got: ${item.path}`);
      });
    }
  }
}

// ── No duplicate slugs ───────────────────────────────────────────────────────

test("no duplicate section slugs", () => {
  const slugs = sections.map((s) => s.slug);
  const unique = new Set(slugs);
  assert.strictEqual(slugs.length, unique.size, `Duplicate slugs found: ${slugs.filter((s, i) => slugs.indexOf(s) !== i)}`);
});

// ── No duplicate item paths within a section ──────────────────────────────────

for (const section of sections) {
  test(`no duplicate item paths in section "${section.title}"`, () => {
    const paths = section.subsections.flatMap((s) => s.items.map((i) => i.path));
    const unique = new Set(paths);
    const dups = paths.filter((p, i) => paths.indexOf(p) !== i);
    assert.strictEqual(
      paths.length,
      unique.size,
      `Duplicate item paths in "${section.title}": ${JSON.stringify(dups)}`
    );
  });
}

// ── Expected categories ───────────────────────────────────────────────────────

const EXPECTED_CATEGORIES = [
  "array", "stack", "queue", "linked-list",
  "tree", "graph", "dp", "ai",
];

test("sections cover expected major categories", () => {
  const slugs = sections.map((s) => s.slug);
  for (const cat of EXPECTED_CATEGORIES) {
    assert.ok(
      slugs.includes(cat),
      `Expected section slug "${cat}" not found. Found: ${JSON.stringify(slugs)}`
    );
  }
});
