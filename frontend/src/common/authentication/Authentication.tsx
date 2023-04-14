import { useAuth } from "react-oidc-context";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { LoginRedirect } from "./LoginRedirect";
import { Box, Container, Typography } from "@mui/material";
import { ReactNode } from "react";

interface AuthProps {
  children: ReactNode;
}

const Loading = () => (
  <Box
    sx={{
      minHeight: "calc(100vh - 155px)",
      height: "80%",
      overflow: "hidden",
      textAlign: "center",
    }}
  >
    Loading...
  </Box>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const UserDetails = ({ auth, children }: any) => {
  console.log(auth.user);
  return (
    <div className="Xyz">
      <div>{`Hello ${auth.user?.profile?.given_name}`}</div>
      <div>{children}</div>
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LoginOptions = ({ auth }: any) => (
  <>
    <Box sx={{ margin: "8px" }}>
      <Button
        id="login-bceid"
        variant="contained"
        onClick={() => {
          auth.signinRedirect({
            extraQueryParams: { kc_idp_hint: "bceidboth" },
          });
        }}
        sx={{ width: "200px" }}
      >
        Log in with BCeID
      </Button>
    </Box>
    <Box sx={{ margin: "8px" }}>
      <Button
        id="login-idir"
        variant="contained"
        onClick={() => {
          auth.signinRedirect({
            extraQueryParams: { kc_idp_hint: "idir" },
          });
        }}
        sx={{ width: "200px" }}
      >
        Log in with IDIR
      </Button>
    </Box>
  </>
);

/*
 * The Authentication component handles user login
 *
 */
export const Authentication = () => {
  const auth = useAuth();

  const RenderAuth = () => {
    if (auth.isLoading) {
      return <Loading />;
    } else if (auth.isAuthenticated) {
      return <LoginRedirect />;
    }

    return <LoginOptions auth={auth} />;
  };

  return (
    <Container
      sx={{
        minHeight: "calc(100vh - 155px)",
        height: "80%",
        overflow: "hidden",
        textAlign: "center",
      }}
    >
      <Typography variant="h3" sx={{ marginBottom: "8px" }}>
        onRouteBC
      </Typography>

      {RenderAuth()}
    </Container>
  );
};
