import React from "react";
import { useFeatureFlagsQuery } from "../hooks/hooks";

const defaultBehaviour: Record<string, string> = {};

const FeatureFlagContext =
  React.createContext<Record<string, string> | undefined>(defaultBehaviour);

export const useFeatureFlagContext = () => {
    return React.useContext(FeatureFlagContext);
}

export const FeatureFlagContextProvider = ({
    children,
  }: {
    children: React.ReactNode
  }) => {
    const featureFlagQuery = useFeatureFlagsQuery();

    return (
      <FeatureFlagContext.Provider value={featureFlagQuery?.data}>
        {children}
      </FeatureFlagContext.Provider>
    )
  }

