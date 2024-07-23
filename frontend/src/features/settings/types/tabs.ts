/**
 * The tabs on the settings page.
 * Index starts at 0.
 */
export const SETTINGS_TABS = {
  SPECIAL_AUTH: 0,
  CREDIT_ACCOUNT: 1,
  SUSPEND: 2,
} as const;

export type SettingsTab = typeof SETTINGS_TABS[keyof typeof SETTINGS_TABS];
