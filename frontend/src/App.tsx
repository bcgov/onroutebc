import { BrowserRouter as Router } from "react-router-dom";
import { AppRoutes } from "./routes/Routes";

import { Header } from "./common/components/header/Header";
import { Footer } from "./common/components/footer/Footer";
import { ThemeProvider } from "@mui/material/styles";
import { bcGovTheme } from "./themes/bcGovTheme";
import { createContext, Dispatch, useEffect, useState } from "react";
import {
  CustomSnackbar,
  SnackBarOptions,
} from "./common/components/snackbar/CustomSnackBar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "react-oidc-context";

const oidcConfig = {
  // https://dev.loginproxy.gov.bc.ca/auth/realms/standard/.well-known/openid-configuration
  // https://dev.loginproxy.gov.bc.ca/auth/.well-known/openid-configuration
  authority: "https://dev.loginproxy.gov.bc.ca/auth/realms/standard",
  realm: "standard",
  client_id: "on-route-bc-direct-4598",
  // redirect_uri: "https://onroutebc-202-frontend.apps.silver.devops.gov.bc.ca/",
  redirect_uri: window.location.origin + "/welcome",
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
    isError: false,
  });
  // Needed the following usestate and useffect code so that the snackbar would disapear/close
  const [displaySnackBar, setDisplaySnackBar] = useState(false);
  useEffect(() => {
    setDisplaySnackBar(snackBar.showSnackbar);
  }, [snackBar]);

  return (
    <AuthProvider {...oidcConfig}>
      <ThemeProvider theme={bcGovTheme}>
        <QueryClientProvider client={queryClient}>
          <SnackBarContext.Provider value={{ setSnackBar: setSnackBar }}>
            <CustomSnackbar
              showSnackbar={displaySnackBar}
              setShowSnackbar={setDisplaySnackBar}
              message={snackBar.message}
              isError={snackBar.isError}
            />
            <Router>
              <Header />
              <AppRoutes />
            </Router>
            <Footer />
          </SnackBarContext.Provider>
        </QueryClientProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
