import { useAuth } from "react-oidc-context";
import { ReactNode } from "react";

interface AuthProps {
    children: ReactNode
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

    if (auth.error) {
        return <div>Oops... {auth.error.message}</div>;
    }

    if (auth.isAuthenticated) {
        return (
            <div className="Xyz">
                <div>
                    Coming here
                </div>
                <div>
                {children}
                </div>
                
            </div>
        );
    }

    return <button onClick={() => void auth.signinRedirect()}>Log in</button>;
};
