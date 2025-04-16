export const ALERT_BANNER_TYPES = {
  INFO: "info",
  SUCCESS: "success",
  WARNING: "warning",
  ERROR: "error",
  ERROR_ALT: "error-alt",
} as const;

export type AlertBannerType =
  (typeof ALERT_BANNER_TYPES)[keyof typeof ALERT_BANNER_TYPES];
