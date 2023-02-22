import { BrowserRouter as Router } from "react-router-dom";
import { AppRoutes } from "./routes/Routes";

import { Header } from "./common/components/header/Header";
import { Footer } from "./common/components/footer/Footer";
import { ThemeProvider } from "@mui/material/styles";
import { bcGovTheme } from "./themes/bcGovTheme";

const App = () => {
  return (
    <ThemeProvider theme={bcGovTheme}>
      <Router>
        <Header />
        <AppRoutes />
      </Router>
      <Footer />
    </ThemeProvider>
  );
};

export default App;
