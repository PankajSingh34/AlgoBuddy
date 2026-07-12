const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_REGEX = /^https?:\/\/.+/;
const HEX_COLOR_REGEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
const ALPHANUMERIC_REGEX = /^[a-zA-Z0-9\s\-_]+$/;

export function isEmail(value) {
  if (typeof value !== "string") return false;
  return EMAIL_REGEX.test(value.trim());
}

export function isUrl(value) {
  if (typeof value !== "string") return false;
  return URL_REGEX.test(value.trim());
}

export function isAlphanumeric(value) {
  if (typeof value !== "string") return false;
  return ALPHANUMERIC_REGEX.test(value.trim());
}

export function isHexColor(value) {
  if (typeof value !== "string") return false;
  return HEX_COLOR_REGEX.test(value.trim());
}

export function isInRange(value, min, max) {
  const num = Number(value);
  return !isNaN(num) && num >= min && num <= max;
}

export function isNonEmptyString(value, maxLength = Infinity) {
  return typeof value === "string" && value.trim().length > 0 && value.length <= maxLength;
}

export function sanitizeString(value, maxLength = 1000) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

export const VALIDATION_RULES = {
  name: {
    validate: (v) => isNonEmptyString(v, 100),
    message: "Name is required and must be under 100 characters",
  },
  email: {
    validate: (v) => isEmail(v),
    message: "A valid email address is required",
  },
  message: {
    validate: (v) => isNonEmptyString(v, 5000),
    message: "Message is required and must be under 5000 characters",
  },
  rating: {
    validate: (v) => isInRange(v, 1, 5),
    message: "Rating must be between 1 and 5",
  },
  code: {
    validate: (v) => isNonEmptyString(v, 50000),
    message: "Code is required and must be under 50000 characters",
  },
  captchaToken: {
    validate: (v) => isNonEmptyString(v, 10000),
    message: "CAPTCHA verification token is required",
  },
};

export function validateFields(data, rules) {
  const errors = [];
  for (const [field, rule] of Object.entries(rules)) {
    const value = data[field];
    if (!rule.validate(value)) {
      errors.push({ field, message: rule.message });
    }
  }
  return {
    valid: errors.length === 0,
    errors,
  };
}

export function parseJsonBody(request) {
  return request.json().catch(() => null);
}
