export const RATE_LIMITS = {
  CONTACT_API: {
    LIMIT: 5,
    WINDOW_MS: 60 * 1000, // 1 minute
  },
  SMTP: {
    DAILY_QUOTA: process.env.SMTP_DAILY_QUOTA ? parseInt(process.env.SMTP_DAILY_QUOTA, 10) : 400,
  }
};
