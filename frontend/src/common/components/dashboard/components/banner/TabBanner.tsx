import { Box } from "@mui/material";
import { useContext } from "react";

import "./TabBanner.scss";
import { TabsList } from "../tab/TabsList";
import { TabComponentProps } from "../tab/types/TabComponentProps";
import { ErrorBcGovBanner } from "../../../banners/ErrorBcGovBanner";
import OnRouteBCContext from "../../../../authentication/OnRouteBCContext";

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
  const { isCompanySuspended } = useContext(OnRouteBCContext);

  return (
    <Box className="tab-banner">
      <div className="tab-banner__left">
        <div className="tab-banner__text-section">
          <h2 className="banner-text">{bannerText}</h2>

          {isCompanySuspended ? (
            <ErrorBcGovBanner
              msg="Company suspended"
              className="suspended"
            />
          ) : null}
        </div>

        {bannerButton ? (
          <Box className="tab-banner__actions--mobile">
            {bannerButton}
          </Box>
        ) : null}

        <TabsList
          value={tabIndex}
          handleChange={onTabChange}
          componentList={componentList}
        />
      </div>
      
      {bannerButton ? (
        <Box className="tab-banner__actions--main">
          {bannerButton}
        </Box>
      ) : null}
    </Box>
  );
};
