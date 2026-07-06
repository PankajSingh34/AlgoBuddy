const persistence = require("../lib/persistence.js");

describe("persistence", () => {
  test("exports expected API", () => {
    expect(persistence).toBeDefined();
  });
});
