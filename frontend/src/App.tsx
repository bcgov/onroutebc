import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AppRoutes } from "./routes/Routes";

import { Header } from "./common/components/header/Header";
import { Footer } from "./common/components/footer/Footer";
import { ThemeProvider } from "@mui/material";
import { appTheme } from "./themes/appTheme";

const App = () => {
  
  return (
    <ThemeProvider theme={appTheme}>
      <Router>
        <Header/>
        <AppRoutes/>
      </Router>
      <Footer/>
    </ThemeProvider>
  );
}

export default App;
