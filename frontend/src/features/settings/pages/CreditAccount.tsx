import "./CreditAccount.scss";
import { SelectCreditLimit } from "../components/creditAccount/SelectCreditLimit";
import { useState } from "react";
import {
  DEFAULT_CREDIT_ACCOUNT_LIMIT,
  EMPTY_CREDIT_ACCOUNT_LIMIT_SELECT,
  CREDIT_ACCOUNT_LIMIT_CHOOSE_FROM_OPTIONS,
  CreditAccountLimitType,
} from "../types/creditAccount";
import { SelectChangeEvent, MenuItem, Button, Box } from "@mui/material";
import { useCreateCreditAccountMutation } from "../hooks/creditAccount";

export const CreditAccount = ({
  companyId,
  hideTab,
}: {
  companyId: number;
  hideTab?: (hide: boolean) => void;
}) => {
  console.log(companyId, hideTab);

  const [invalid, setInvalid] = useState<boolean>(false);

  const [chooseFrom, setChooseFrom] = useState<
    CreditAccountLimitType | typeof EMPTY_CREDIT_ACCOUNT_LIMIT_SELECT
  >(DEFAULT_CREDIT_ACCOUNT_LIMIT);

  const handleChooseFrom = (event: SelectChangeEvent) => {
    setInvalid(false);
    setChooseFrom(
      event.target.value as
        | CreditAccountLimitType
        | typeof EMPTY_CREDIT_ACCOUNT_LIMIT_SELECT,
    );
  };

  const createCreditAccountMutation = useCreateCreditAccountMutation();

  const isActionSuccessful = (status: number) => {
    return status === 201;
  };

  const handleCreateCreditAccount = async () => {
    if (chooseFrom !== EMPTY_CREDIT_ACCOUNT_LIMIT_SELECT) {
      setInvalid(false);
      const createCreditAccountResult =
        await createCreditAccountMutation.mutateAsync({
          companyId,
          data: {
            creditLimit: chooseFrom,
          },
        });

      if (isActionSuccessful(createCreditAccountResult.status)) {
        console.log(createCreditAccountResult);
      }
    } else {
      setInvalid(true);
    }
  };

  return (
    <div className="credit-account-page">
      <h3 className="credit-account-page__title">Add Credit Account</h3>
      <Box className="add-credit-account-action">
        <div>
          <SelectCreditLimit
            value={chooseFrom}
            label={"Credit Limit"}
            onChange={handleChooseFrom}
            menuItems={CREDIT_ACCOUNT_LIMIT_CHOOSE_FROM_OPTIONS.map((data) => (
              <MenuItem key={data.value} value={data.value}>
                {data.label}
              </MenuItem>
            ))}
            invalid={invalid}
          />
        </div>
        <Button
          className={`add-credit-account-action__btn ${invalid && "add-credit-account-action__btn--error"}`}
          variant="contained"
          onClick={handleCreateCreditAccount}
        >
          Add Credit Account
        </Button>
      </Box>
    </div>
  );
};
