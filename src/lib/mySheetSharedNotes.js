export function getSharedNote(row) {
  if (!row?.shared_notes) return "";
  return row.note || "";
}
