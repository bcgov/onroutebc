import { Box } from "@mui/material";

import "./TabBanner.scss";
import { TabsList } from "../tab/TabsList";
import { TabComponentProps } from "../tab/types/TabComponentProps";

export const TabBanner = ({
  bannerText,
  bannerButton,
  componentList,
  tabIndex,
  onTabChange,
}: {
  bannerText: string;
  bannerButton?: JSX.Element;
  componentList: TabComponentProps[];
  tabIndex: number;
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
}) => {
  return (
    <Box className="tab-banner">
      <div className="tab-banner__left">
        <div className="tab-banner__text-section">
          <h2 className="banner-text">{bannerText}</h2>
        </div>

        {bannerButton ? (
          <Box className="tab-banner__actions--mobile">{bannerButton}</Box>
        ) : null}

        <TabsList
          value={tabIndex}
          handleChange={onTabChange}
          componentList={componentList}
        />
      </div>

      {bannerButton ? (
        <Box className="tab-banner__actions--main">{bannerButton}</Box>
      ) : null}
    </Box>
  );
};
