import { useAuth } from "react-oidc-context";
import { ReactNode } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { LoginRedirect } from "./LoginRedirect";

interface AuthProps {
  children: ReactNode;
}

/*
 * The Authentication component handles user login
 *
 */
export const Authentication = ({ children }: AuthProps) => {
  const auth = useAuth();

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.isAuthenticated) {
    console.log(auth.user);
    return <>{children}</>;
  }

  return (
    <div>
      <Grid container></Grid>
      <div style={{ marginTop: "10px" }}>
        <span>Use your BCeID</span>
        <Button
          id="login-bceid"
          variant="contained"
          onClick={() =>
            void auth.signinRedirect({
              extraQueryParams: { kc_idp_hint: "bceidboth" },
            })
          }
        >
          Log in with BCeID
        </Button>
      </div>
      <br />
      <div>
        <span>Use your IDIR</span>
        <Button
          id="login-idir"
          variant="contained"
          onClick={() =>
            void auth.signinRedirect({
              extraQueryParams: { kc_idp_hint: "idir" },
            })
          }
        >
          Log in with IDIR
        </Button>
      </div>
    </div>
  );
};
