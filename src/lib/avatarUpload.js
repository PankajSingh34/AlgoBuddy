const ALLOWED_AVATAR_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MIME_TO_EXTENSIONS = {
  "image/jpeg": ["jpg", "jpeg"],
  "image/png": ["png"],
  "image/webp": ["webp"],
};

const ALLOWED_AVATAR_ACCEPT_TYPES = "image/jpeg,image/png,image/webp";

const getFileExtension = (fileName) => {
  if (typeof fileName !== "string" || !fileName.includes(".")) return "";
  return fileName.split(".").pop()?.trim().toLowerCase() || "";
};

const isAllowedAvatarFile = (file) => {
  if (!file || typeof file !== "object") return false;

  const mimeType = typeof file.type === "string" ? file.type.trim().toLowerCase() : "";
  const extension = getFileExtension(file.name);

  if (!ALLOWED_AVATAR_MIME_TYPES.has(mimeType)) return false;

  const allowedExtensions = MIME_TO_EXTENSIONS[mimeType] || [];
  return Boolean(extension) && allowedExtensions.includes(extension);
};

export {
  ALLOWED_AVATAR_ACCEPT_TYPES,
  ALLOWED_AVATAR_MIME_TYPES,
  isAllowedAvatarFile,
};
