import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const CustomLinkContent = ({
  withLinkIcon,
  children,
}: {
  withLinkIcon?: boolean;
  children?: React.ReactNode;
}) => {
  return (
    <>
      <span className="custom-link__link">{children}</span>

      {withLinkIcon ? (
        <FontAwesomeIcon
          className="custom-link__icon"
          icon={faArrowUpRightFromSquare}
        />
      ) : null}
    </>
  );
};
