import { useState } from "react";

import "./UserSection.scss";
import { LogoutButton } from "./LogoutButton";
import { UserSectionInfo } from "./UserSectionInfo";

export const UserSection = ({
  username,
}: {
  username: string;
}) => {
  const [showLogoutBtn, setShowLogoutBtn] = useState(false);

  return (
    <div 
      className="user-section" 
      onMouseOver={() => setShowLogoutBtn(true)} 
      onMouseOut={() => setShowLogoutBtn(false)}
    >
      <UserSectionInfo username={username} />
      {showLogoutBtn ? (
        <div className="user-section__logout">
          <LogoutButton />
        </div>
      ) : null}
    </div>
  );
};