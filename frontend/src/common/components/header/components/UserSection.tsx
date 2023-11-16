import "./UserSection.scss";
import { LogoutButton } from "./LogoutButton";
import { UserSectionInfo } from "./UserSectionInfo";

export const UserSection = ({ username }: { username: string }) => {
  return (
    <div className="user-section">
      <UserSectionInfo username={username} />
      <LogoutButton />
    </div>
  );
};
