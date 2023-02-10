import { BrowserRouter as Router } from "react-router-dom";
import { AppRoutes } from "./routes/Routes";

import { Header } from "./common/components/header/Header";
import { Footer } from "./common/components/footer/Footer";
import { ThemeProvider } from "@mui/material/styles";
import { bcGovTheme } from "./themes/bcGovTheme";
import { AuthProvider } from "react-oidc-context";

const oidcConfig = {
  // https://dev.loginproxy.gov.bc.ca/auth/realms/standard/.well-known/openid-configuration
  // https://dev.loginproxy.gov.bc.ca/auth/.well-known/openid-configuration
  authority: "https://dev.loginproxy.gov.bc.ca/auth/realms/standard",
  realm: "standard",
  client_id: "on-route-bc-4452",
  redirect_uri: "https://onroutebc-190-frontend.apps.silver.devops.gov.bc.ca",
  scope: "openid",
  client_secret: "YM2f3sPiukt7HV33BoHjGfBgWFwGMmmm",
  automaticSilentRenew: true,
  revokeTokensOnSignout: true,
};

const App = () => {
  return (
    <AuthProvider {...oidcConfig}>
      <ThemeProvider theme={bcGovTheme}>
        <Router>
          <Header />
          <AppRoutes />
        </Router>
        <Footer />
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
