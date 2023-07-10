import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";

import "./UserSectionInfo.scss";

export const UserSectionInfo = ({
  username,
}: {
  username: string;
}) => {
  return (
    <div className="user-section-info">
      <FontAwesomeIcon 
        className="user-section-info__avatar" 
        icon={faCircleUser} 
      />
      <p className="user-section-info__username">
        {username}
      </p>
    </div>
  );
};
