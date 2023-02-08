import { BrowserRouter as Router } from "react-router-dom";
import { AppRoutes } from "./routes/Routes";

import { Header } from "./common/components/header/Header";
import { Footer } from "./common/components/footer/Footer";
import { ThemeProvider } from "@mui/material/styles";
import { bcGovTheme } from "./themes/bcGovTheme";
import { AuthProvider } from "react-oidc-context";

const oidcConfig = {
  authority: "https://dev.loginproxy.gov.bc.ca/auth",
  realm: "standard",
  client_id: "on-route-bc-4452",
  redirect_uri: "http://localhost:3000",
  scope: "openid",
  automaticSilentRenew: true,
  revokeTokensOnSignout: true,
};

const App = () => {
  return (
    // <AuthProvider {...oidcConfig}>
      <ThemeProvider theme={bcGovTheme}>
        <Router>
          <Header />
          <AppRoutes />
        </Router>
        <Footer />
      </ThemeProvider>
    // {/* </AuthProvider> */}
  );
};

export default App;
