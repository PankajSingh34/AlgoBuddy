const test = require("node:test");
const assert = require("node:assert/strict");

async function loadToCSV() {
  const module = await import("../src/lib/csvExport.js");
  return module.toCSV;
}

const columns = [{ key: "value", label: "Value" }];

test("toCSV neutralizes formula-prefixed values", async () => {
  const toCSV = await loadToCSV();

  const dangerous = [
    '=HYPERLINK("https://example.com","click")',
    "+1+1",
    "-1+1",
    "@SUM(A1:A2)",
    "\tmalicious",
    "\rmalicious",
  ];

  for (const value of dangerous) {
    const csv = toCSV([{ value }], columns);
    const line = csv.split("\n")[1];
    assert.ok(
      line.startsWith("'") || line.startsWith("\"'"),
      `expected "${value}" to be neutralized, got "${line}"`,
    );
  }
});

test("toCSV leaves normal strings unchanged", async () => {
  const toCSV = await loadToCSV();

  const csv = toCSV([{ value: "Software Engineer" }], columns);
  assert.equal(csv, "Value\nSoftware Engineer\n");
});

test("toCSV still quotes commas, quotes, and newlines", async () => {
  const toCSV = await loadToCSV();

  const csv = toCSV([{ value: 'Acme, Inc. "Best"' }], columns);
  assert.equal(csv, 'Value\n"Acme, Inc. ""Best"""\n');
});

test("toCSV quotes a neutralized formula value that also contains a comma", async () => {
  const toCSV = await loadToCSV();

  const csv = toCSV([{ value: "=A1,B1" }], columns);
  assert.equal(csv, 'Value\n"\'=A1,B1"\n');
});
