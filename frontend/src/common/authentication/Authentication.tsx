import { useAuth } from "react-oidc-context";
import { ReactNode } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

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

//   if (auth.error) {
//     return <div>Oops... {auth.error.message}</div>;
//   }

  if (auth.isAuthenticated) {
    console.log(auth.user);
    return (
      <div className="Xyz">
        <div>{`Hello ${auth.user?.profile?.display_name}`}</div>
        <div>{children}</div>
      </div>
    );
  }

  return (
    <div>
        <Grid container>

        </Grid>
      <div style={{ marginTop: '10px'}}>
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

  // return <button onClick={() => void auth.signinRedirect()}>Log in</button>;
};