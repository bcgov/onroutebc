import {IDPS} from '../../types/idp'
import './NavIconSideBar.scss'
import { useAuth } from 'react-oidc-context'
import OnRouteBCContext from "../../../common/authentication/OnRouteBCContext";
import React, { useContext } from "react";
import { USER_AUTH_GROUP } from '../../../features/manageProfile/types/userManagement.d';

interface NavIconSideBarProps {
  children?: React.ReactNode;
}

/**
 * Displays a sidebar with NavIcon buttons as children
 */
export const NavIconSideBar = (props: NavIconSideBarProps) => {
  const { children } = props
  const { user } = useAuth()
  const isIdir = user?.profile?.identity_provider === IDPS.IDIR
  const { idirUserDetails } = useContext(OnRouteBCContext)
  const isEofficer = idirUserDetails?.userAuthGroup === USER_AUTH_GROUP.EOFFICER

  return (
    <div className="nav-icon-side-bar">
      {isIdir && !isEofficer && children}
    </div>
  )
}


  