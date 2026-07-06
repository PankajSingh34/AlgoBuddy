export const AVATAR_BUCKET = "avatars";
export const MAX_AVATAR_FILE_SIZE = 2 * 1024 * 1024;
export const MAX_AVATAR_URL_LENGTH = 512;
export const MAX_PROFILE_URL_LENGTH = 512;
export const MAX_BIO_LENGTH = 300;

export const PROFILE_URL_FIELDS = ["resume_link", "github_profile", "linkedin_profile"];

export const PRESET_PROJECT_GRADIENTS = [
  "bg-[linear-gradient(135deg,#190f4f,#25116d_45%,#5338f2)]",
  "bg-[linear-gradient(135deg,#064e3b,#0f172a)]",
  "bg-[linear-gradient(135deg,#312e81,#111827)]",
  "bg-[linear-gradient(135deg,#7c2d12,#1c1917)]",
  "bg-[linear-gradient(135deg,#134e4a,#0f172a)]",
  "bg-[linear-gradient(135deg,#1e1b4b,#312e81)]",
];

export const EMPTY_PROJECT = {
  title: "",
  subtitle: "",
  tags: "",
  url: "",
  preview: PRESET_PROJECT_GRADIENTS[0],
};

export const CODING_PLATFORMS = [
  ["leetcode", "leetcode_username", "LeetCode Username", "leetcode_solved", "Solved"],
  ["codeforces", "codeforces_username", "Codeforces Handle", "codeforces_rating", "Rating"],
  ["codechef", "codechef_username", "CodeChef Username", "codechef_stars", "Stars"],
  ["github", "github_username", "GitHub Username", "github_contributions", "Contributions"],
];

export const ONBOARDING_OPTIONAL_FIELDS = [
  ["college", "College / University", "Your college name"],
  ["branch", "Branch", "Computer Science"],
  ["location", "Location", "City, Country"],
  ["github_profile", "GitHub URL", "https://github.com/..."],
  ["linkedin_profile", "LinkedIn URL", "https://linkedin.com/in/..."],
  ["resume_link", "Portfolio URL", "https://..."],
];

export const ONBOARDING_CODING_FIELDS = CODING_PLATFORMS.map(
  ([, usernameField, usernameLabel]) => [usernameField, usernameLabel.replace(" Username", "").replace(" Handle", ""), "username"],
);

export const EMPTY_PROFILE_FORM = {
  name: "",
  branch: "",
  college: "",
  location: "",
  skills: "",
  resume_link: "",
  github_profile: "",
  linkedin_profile: "",
  email_notifications: true,
  avatar_url: "",
  leetcode_username: "",
  leetcode_solved: 0,
  codeforces_username: "",
  codeforces_rating: 0,
  codechef_username: "",
  codechef_stars: 0,
  github_username: "",
  github_contributions: 0,
  projects: [],
};

export const safeAvatarUrl = (value) => {
  if (typeof value !== "string") return "";
  if (value.startsWith("data:")) return "";
  if (value.length > MAX_AVATAR_URL_LENGTH) return "";
  return value;
};

export const safeExternalUrl = (value) => {
  if (typeof value !== "string" || value.length > MAX_PROFILE_URL_LENGTH) return "";
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return "";
    return parsed.toString();
  } catch {
    return "";
  }
};

export const sanitizeProfileLinks = (data) => {
  const nextData = { ...data };

  for (const field of PROFILE_URL_FIELDS) {
    if (!nextData[field]) continue;
    const safeUrl = safeExternalUrl(nextData[field]);
    if (!safeUrl) {
      return { error: "Please enter valid http or https URLs for profile links." };
    }
    nextData[field] = safeUrl;
  }

  return { data: nextData };
};

export const buildFormDataFromUser = (user) => {
  const meta = user?.user_metadata || {};
  return {
    name: meta.name || "",
    branch: meta.branch || "",
    college: meta.college || "",
    location: meta.location || meta.address || "",
    skills: (meta.skills || "").slice(0, MAX_BIO_LENGTH),
    resume_link: meta.resume_link || "",
    github_profile: meta.github_profile || "",
    linkedin_profile: meta.linkedin_profile || "",
    email_notifications: meta.email_notifications !== false,
    avatar_url: safeAvatarUrl(meta.avatar_url || meta.picture),
    leetcode_username: meta.leetcode_username || "",
    leetcode_solved: meta.leetcode_solved || 0,
    codeforces_username: meta.codeforces_username || "",
    codeforces_rating: meta.codeforces_rating || 0,
    codechef_username: meta.codechef_username || "",
    codechef_stars: meta.codechef_stars || 0,
    github_username: meta.github_username || "",
    github_contributions: meta.github_contributions || 0,
    projects: Array.isArray(meta.projects) ? meta.projects : [],
  };
};

export const normalizeProfilePayload = (data) => ({
  ...data,
  leetcode_solved: Number(data.leetcode_solved) || 0,
  codeforces_rating: Number(data.codeforces_rating) || 0,
  codechef_stars: Number(data.codechef_stars) || 0,
  github_contributions: Number(data.github_contributions) || 0,
  projects: Array.isArray(data.projects) ? data.projects : [],
});

export const validateProfileForm = (formData, mode = "edit") => {
  if (mode !== "onboarding") return null;

  if (!formData.name?.trim()) {
    return "Full name is required.";
  }

  if (!formData.skills?.trim()) {
    return "Bio is required.";
  }

  return null;
};

export const isOnboardingStep1Valid = (formData) =>
  Boolean(formData.name?.trim() && formData.skills?.trim());

export const shouldShowProfileSetup = (user) => {
  if (!user) return false;
  return user.user_metadata?.hasSeenProfileSetup !== true;
};
