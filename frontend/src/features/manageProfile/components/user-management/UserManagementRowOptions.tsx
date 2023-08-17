import { useNavigate } from "react-router-dom";
import { OnRouteBCTableRowActions } from "../../../../common/components/table/OnRouteBCTableRowActions";
import { EDIT_USER } from "../../../../routes/constants";

const OPTIONS = ["Edit"];

export const UserManagementTableRowActions = ({
  userGUID,
}: {
  userGUID: string;
}) => {
  const navigate = useNavigate();

  const onClickCallback = (selectedOption: string) => {
    if (selectedOption === "Edit") {
      navigate(`${EDIT_USER}/${userGUID}`, {
        state: {
          userGUID,
        },
      });
    }
  };

  return (
    <>
      <OnRouteBCTableRowActions
        onSelectOption={onClickCallback}
        options={OPTIONS}
      />
    </>
  );
};
