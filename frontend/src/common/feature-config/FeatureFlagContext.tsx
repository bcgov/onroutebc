import React from "react";

/**
 * The list of features with a feature flag.
 */
export const FEATURE_NAMES = {
  COMPANY_SEARCH: "COMPANY_SEARCH",
} as const;

/**
 * The enum type for feature names.
 */
export type FeatureNamesType =
  (typeof FEATURE_NAMES)[keyof typeof FEATURE_NAMES];

/**
 * Returns boolean indicating if a feature is enabled.
 * @param featureName The name of the feature.
 * @returns boolean
 */
export const isFeatureEnabled = (featureName: string): boolean => {
  const featureFlags =
    import.meta.env.VITE_FEATURE_FLAGS || envConfig.VITE_FEATURE_FLAGS;
  const featureFlagObject = JSON.parse(featureFlags);
  return featureFlagObject[featureName] === "ENABLED";
};

export const FeatureFlagContext = React.createContext({});
