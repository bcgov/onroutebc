import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faFileLines, faHome } from "@fortawesome/free-solid-svg-icons";

export const NAV_BUTTON_TYPES = {
  HOME: "home",
  REPORT: "report",
} as const;

export type NavButtonType =
  (typeof NAV_BUTTON_TYPES)[keyof typeof NAV_BUTTON_TYPES];

export const getNavButtonTitle = (type: NavButtonType): string => {
  if (type === NAV_BUTTON_TYPES.HOME) {
    return "Home";
  }

  return "Report";
};

export const getIcon = (type: NavButtonType): IconDefinition => {
  if (type === NAV_BUTTON_TYPES.HOME) {
    return faHome;
  }

  return faFileLines;
};
