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
    import.meta.env.ONROUTEBC_FEATURE_FLAGS ||
    envConfig.ONROUTEBC_FEATURE_FLAGS;
  try {
    const featureFlagObject = JSON.parse(featureFlags.replaceAll("\n", ""));
    console.log(featureFlagObject);
    return featureFlagObject[featureName] === "ENABLED";
  } catch (error) {
    console.log("Error parsing json::", error);
    // Adding a comment
  }
  return false;
};

export const FeatureFlagContext = React.createContext({});
