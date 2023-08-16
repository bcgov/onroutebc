import { useNavigate } from "react-router-dom";
import { OnRouteBCTableRowActions } from "../../../../common/components/table/OnRouteBCTableRowActions";

const OPTIONS = ["Edit"];

export const UserManagementTableRowActions = ({
  userGUID,
}: {
  userGUID: string;
}) => {
  const navigate = useNavigate();

  const onClickCallback = (selectedOption: string) => {
    if (selectedOption === "Edit") {
      navigate(`/edit-user`, {
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
