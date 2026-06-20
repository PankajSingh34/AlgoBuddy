import fs from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "resumes");
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx"];

export function validateResumeFile(file) {
  if (!file) {
    return { valid: false, error: "No file provided" };
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { valid: false, error: "Only PDF and DOC/DOCX files are allowed" };
  }

  const ext = path.extname(file.name).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return { valid: false, error: "Invalid file extension" };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: "File size must be under 5MB" };
  }

  return { valid: true };
}

export async function saveResumeFile(file, userId) {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });

  const ext = path.extname(file.name).toLowerCase();
  const safeName = `${userId}-${Date.now()}${ext}`;
  const filePath = path.join(UPLOAD_DIR, safeName);

  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, buffer);

  return `/uploads/resumes/${safeName}`;
}
