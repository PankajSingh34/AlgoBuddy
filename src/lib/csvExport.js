const FORMULA_PREFIXES = ["=", "+", "-", "@", "\t", "\r"];

function escapeCSV(value) {
  if (value == null) return "";
  let str = String(value);

  if (FORMULA_PREFIXES.some((prefix) => str.startsWith(prefix))) {
    str = `'${str}`;
  }

  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function toCSV(rows, columns) {
  const header = columns.map((c) => escapeCSV(c.label)).join(",");
  const body = rows
    .map((row) => columns.map((c) => escapeCSV(row[c.key])).join(","))
    .join("\n");
  return header + "\n" + body + "\n";
}
