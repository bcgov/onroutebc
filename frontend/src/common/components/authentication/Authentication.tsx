import { useAuth } from "react-oidc-context";
import { ReactNode } from "react";
import Button from "@mui/material/Button";
import { Box, Container, Typography } from "@mui/material";

interface AuthProps {
  children: ReactNode;
}

/*
 * The Authentication component handles user login
 *
 */
export const Authentication = ({ children }: AuthProps) => {
  const auth = useAuth();

  const Loading = () => <div>Loading...</div>;

  const UserDetails = () => {
    console.log(auth.user);
    return (
      <div className="Xyz">
        <div>{`Hello ${auth.user?.profile?.given_name}`}</div>
        <div>{children}</div>
      </div>
    );
  };

  const LoginOptions = () => (
    <>
      <Box sx={{ margin: "8px" }}>
        <Button
          id="login-bceid"
          variant="contained"
          onClick={() =>
            void auth.signinRedirect({
              extraQueryParams: { kc_idp_hint: "bceidboth" },
            })
          }
          sx={{ width: "200px" }}
        >
          Log in with BCeID
        </Button>
      </Box>
      <Box sx={{ margin: "8px" }}>
        <Button
          id="login-idir"
          variant="contained"
          disabled={true}
          onClick={() =>
            void auth.signinRedirect({
              extraQueryParams: { kc_idp_hint: "idir" },
            })
          }
          sx={{ width: "200px" }}
        >
          Log in with IDIR
        </Button>
      </Box>
    </>
  );

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
        onRouteBC Proof of Concept - Alpha
      </Typography>

      {auth.isLoading ? (
        <Loading />
      ) : auth.isAuthenticated ? (
        <UserDetails />
      ) : (
        <LoginOptions />
      )}
    </Container>
  );

  // return <button onClick={() => void auth.signinRedirect()}>Log in</button>;
};
