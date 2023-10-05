
import { IDP } from '../../enum/idp.enum'
import './NavIconSideBar.scss'
import { useAuth } from 'react-oidc-context'

interface NavIconSideBarProps {
  children?: React.ReactNode;
}

/**
 * Displays a sidebar with NavIcon buttons as children
 */
export const NavIconSideBar = (props: NavIconSideBarProps) => {
  const { children } = props;
  const { user } = useAuth()
  const isIdir = user?.profile?.identity_provider === IDP.IDIR

  return (
    <div className="nav-icon-side-bar">
      {isIdir && children}
    </div>
  )
}


  