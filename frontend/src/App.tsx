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

export const SnackBarContext = createContext({
  setSnackBar: (() => undefined) as Dispatch<SnackBarOptions>,
});

const App = () => {
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
    <SnackBarContext.Provider value={{ setSnackBar: setSnackBar }}>
      <CustomSnackbar
        showSnackbar={displaySnackBar}
        setShowSnackbar={setDisplaySnackBar}
        message={snackBar.message}
        isError={snackBar.isError}
      />
      <ThemeProvider theme={bcGovTheme}>
        <Router>
          <Header />
          <AppRoutes />
        </Router>
        <Footer />
      </ThemeProvider>
    </SnackBarContext.Provider>
  );
};

export default App;
