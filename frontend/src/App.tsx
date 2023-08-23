import { BrowserRouter as Router } from "react-router-dom";
import { AppRoutes } from "./routes/Routes";

import { Header } from "./common/components/header/Header";
import { Footer } from "./common/components/footer/Footer";
import { ThemeProvider } from "@mui/material/styles";
import { bcGovTheme } from "./themes/bcGovTheme";
import { createContext, Dispatch, useEffect, useMemo, useState } from "react";
import {
  CustomSnackbar,
  SnackBarOptions,
} from "./common/components/snackbar/CustomSnackBar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "react-oidc-context";
import OnRouteBCContext, {
  BCeIDUserDetailContext,
  IDIRUserDetailContext,
} from "./common/authentication/OnRouteBCContext";

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

  const [userRoles, setUserRoles] = useState<string[] | undefined>();
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
              };
            }, [userRoles, companyId, userDetails])}
          >
            <SnackBarContext.Provider value={{ setSnackBar: setSnackBar }}>
              <CustomSnackbar
                showSnackbar={displaySnackBar}
                setShowSnackbar={setDisplaySnackBar}
                message={snackBar.message}
                alertType={snackBar.alertType}
              />
              <Router>
                <Header />
                <AppRoutes />
              </Router>
              <Footer />
            </SnackBarContext.Provider>
          </OnRouteBCContext.Provider>
        </QueryClientProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
