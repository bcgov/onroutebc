export const ASW_TABLE_ROW_TYPES = {
  AXLE: "axle",
  SPACING: "spacing",
};

export type ASWTableRowType =
  (typeof ASW_TABLE_ROW_TYPES)[keyof typeof ASW_TABLE_ROW_TYPES];
