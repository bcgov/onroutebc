import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as routes from "../../constants/routes";

/*
 * Redirects user to their correct landing page after loading their
 * user and company info.
 *
 */
export const LoginRedirect = () => {
    const navigate = useNavigate();
  
    // const userQuery = useQuery({
    //   queryKey: ["userContext"],
    //   queryFn: getPowerUnitTypes,
    //   retry: false,
    // });
  
    const user = true;
    const company = false;
    const pendingUser = false;
  
    useEffect(() => {
      if (!user) {
        if (pendingUser) {
          navigate(routes.USER_INFO);
        } else if (!company) {
          navigate(routes.WELCOME);
        }
      } else {
        navigate(routes.HOME);
      }
      
    }, [user, pendingUser, company]);
  
    /**
     * GET User info
     * GET Company info
     * if (user && company)
     *    navigate(routes.HOME)
     *    
     *    // Multiple companies off scope.
     *
     * if (!user)
     *    if (pendingUser)
     *        navigate(routes.MY_INFO)
     *    if (!company)
     *        navigate(routes.COMPANY_INFO)
     *    else
     *        Error Page.
     
     * if (company && user) useNavigate(routes.HOME)
     * if (company && !user) useNavigate(routes.MY_INFO)
     * if (!user && !company) useNavigate(routes.COMPANY_INFO)
     * if (company && !user) useNavigate(routes.HOME)
     */
    //
  
    return <></>;
  };