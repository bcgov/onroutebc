import { ThemeProvider } from "@mui/material/styles";
import userEvent from "@testing-library/user-event";

import { renderWithClient } from "../../../../../../../common/helpers/testHelper";
import OnRouteBCContext, { OnRouteBCContextType } from "../../../../../../../common/authentication/OnRouteBCContext";
import { bcGovTheme } from "../../../../../../../themes/bcGovTheme";
import { ApplicationDashboard } from "../../../ApplicationDashboard";

export const ComponentWithWrapper = (userDetails: OnRouteBCContextType) => {
  return (
    <ThemeProvider theme={bcGovTheme}>
      <OnRouteBCContext.Provider value={userDetails}>
        <ApplicationDashboard />
      </OnRouteBCContext.Provider>
    </ThemeProvider>
  );
};

export const renderTestComponent = (userDetails: OnRouteBCContextType) => {
  const user = userEvent.setup();
  const component = renderWithClient(
    ComponentWithWrapper(userDetails)
  );

  return { user, component };
};
