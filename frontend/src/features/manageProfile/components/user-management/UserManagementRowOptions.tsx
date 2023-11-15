import { useNavigate } from "react-router-dom";

import { OnRouteBCTableRowActions } from "../../../../common/components/table/OnRouteBCTableRowActions";
import { PROFILE_ROUTES } from "../../../../routes/constants";

const USER_MANAGEMENT_OPTION_TYPES = {
  EDIT: "edit",
} as const;

type UserManagementOptionType = typeof USER_MANAGEMENT_OPTION_TYPES[keyof typeof USER_MANAGEMENT_OPTION_TYPES];

const USER_MANAGEMENT_OPTIONS: {
  label: string;
  value: UserManagementOptionType;
}[] = [
  { 
    label: "Edit",
    value: USER_MANAGEMENT_OPTION_TYPES.EDIT,
  },
];

export const UserManagementTableRowActions = ({
  userGUID,
}: {
  userGUID: string;
}) => {
  const navigate = useNavigate();

  const onClickCallback = (selectedOption: string) => {
    if (selectedOption === USER_MANAGEMENT_OPTION_TYPES.EDIT) {
      navigate(`${PROFILE_ROUTES.EDIT_USER}/${userGUID}`, {
        state: {
          userGUID,
        },
      });
    }
  };

  return (
    <OnRouteBCTableRowActions
      onSelectOption={onClickCallback}
      options={USER_MANAGEMENT_OPTIONS}
    />
  );
};
