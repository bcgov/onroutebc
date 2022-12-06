import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AppRoutes } from "./routes/Routes";

import { Header } from "./common/components/header/Header";
import { Footer } from "./common/components/footer/Footer";

const App = () => {

  return (
    <>
      <Router>
        <Header/>
        <AppRoutes/>
      </Router>
      <Footer/>
    </>
  );
}

export default App;
