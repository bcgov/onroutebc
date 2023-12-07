import { BrowserRouter as Router } from "react-router-dom";
import { AppRoutes } from "./routes/Routes";
import { ThemeProvider } from "@mui/material/styles";
import { createContext, Dispatch, useEffect, useMemo, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "react-oidc-context";

import "./App.scss";
import { Header } from "./common/components/header/Header";
import { Footer } from "./common/components/footer/Footer";
import { bcGovTheme } from "./themes/bcGovTheme";
import {
  CustomSnackbar,
  SnackBarOptions,
} from "./common/components/snackbar/CustomSnackBar";
import OnRouteBCContext, {
  BCeIDUserDetailContext,
  IDIRUserDetailContext,
} from "./common/authentication/OnRouteBCContext";
import { NavIconSideBar } from "./common/components/naviconsidebar/NavIconSideBar";
import { NavIconHomeButton } from "./common/components/naviconsidebar/NavIconHomeButton";
import { NavIconReportButton } from "./common/components/naviconsidebar/NavIconReportButton";
import { MigratedClient } from "./common/authentication/types";

const authority =
  import.meta.env.VITE_AUTH0_ISSUER_URL || envConfig.VITE_AUTH0_ISSUER_URL;

const client_id =
  import.meta.env.VITE_AUTH0_AUDIENCE || envConfig.VITE_AUTH0_AUDIENCE;

/**
 * The OIDC Configuration needed for authentication.
 */
const oidcConfig = {
  authority: authority,
  client_id: client_id,
  redirect_uri: window.location.origin + "/",
  scope: "openid",
  automaticSilentRenew: true,
  revokeTokensOnSignout: true,
};

/**
 * The Snackbar Context for the application.
 */
export const SnackBarContext = createContext({
  setSnackBar: (() => undefined) as Dispatch<SnackBarOptions>,
});

const App = () => {
  const queryClient = new QueryClient();

  // Globally used SnackBar component
  const [snackBar, setSnackBar] = useState<SnackBarOptions>({
    showSnackbar: false,
    setShowSnackbar: () => undefined,
    message: "",
    alertType: "info",
  });

  const [userRoles, setUserRoles] = useState<string[] | null | undefined>();
  const [companyId, setCompanyId] = useState<number | undefined>();
  const [onRouteBCClientNumber, setOnRouteBCClientNumber] = useState<
    string | undefined
  >();
  const [companyLegalName, setCompanyLegalName] = useState<
    string | undefined
  >();
  const [userDetails, setUserDetails] = useState<
    BCeIDUserDetailContext | undefined
  >();
  const [idirUserDetails, setIDIRUserDetails] = useState<
    IDIRUserDetailContext | undefined
  >();
  const [migratedClient, setMigratedClient] = useState<
    MigratedClient | undefined
  >();

  // Needed the following usestate and useffect code so that the snackbar would disapear/close
  const [displaySnackBar, setDisplaySnackBar] = useState(false);
  useEffect(() => {
    setDisplaySnackBar(snackBar.showSnackbar);
  }, [snackBar]);

  return (
    <AuthProvider {...oidcConfig}>
      <ThemeProvider theme={bcGovTheme}>
        <QueryClientProvider client={queryClient}>
          <OnRouteBCContext.Provider
            value={useMemo(() => {
              return {
                userRoles,
                setUserRoles,
                companyId,
                setCompanyId,
                userDetails,
                setUserDetails,
                companyLegalName,
                setCompanyLegalName,
                idirUserDetails,
                setIDIRUserDetails,
                onRouteBCClientNumber,
                setOnRouteBCClientNumber,
                migratedClient,
                setMigratedClient,
              };
            }, [
              userRoles,
              companyId,
              userDetails,
              companyLegalName,
              idirUserDetails,
              onRouteBCClientNumber,
              migratedClient,
            ])}
          >
            <SnackBarContext.Provider value={{ setSnackBar: setSnackBar }}>
              <CustomSnackbar
                showSnackbar={displaySnackBar}
                setShowSnackbar={setDisplaySnackBar}
                message={snackBar.message}
                alertType={snackBar.alertType}
              />
              <div className="page-section">
                <Router>
                  <Header />
                  <NavIconSideBar>
                    <NavIconHomeButton />
                    <NavIconReportButton />
                  </NavIconSideBar>
                  <AppRoutes />
                </Router>
              </div>
              <Footer />
            </SnackBarContext.Provider>
          </OnRouteBCContext.Provider>
        </QueryClientProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
