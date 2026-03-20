import {
  Box,
  Button,
  MenuItem,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { SelectCreditLimit } from "../components/creditAccount/SelectCreditLimit";
import { useCreateCreditAccountMutation } from "../hooks/creditAccount";
import {
  CREDIT_ACCOUNT_LIMIT_CHOOSE_FROM_OPTIONS,
  CreditAccountLimitType,
  DEFAULT_CREDIT_ACCOUNT_LIMIT,
  EMPTY_CREDIT_ACCOUNT_LIMIT_SELECT,
} from "../types/creditAccount";
import "./CreditAccount.scss";
import { useQueryClient } from "@tanstack/react-query";

export const AddCreditAccount = ({ companyId }: { companyId: number }) => {
  const [invalid, setInvalid] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const [selectedCreditLimit, setSelectedCreditLimit] = useState<
    CreditAccountLimitType | typeof EMPTY_CREDIT_ACCOUNT_LIMIT_SELECT
  >(DEFAULT_CREDIT_ACCOUNT_LIMIT);

  const handleSelectedCreditLimit = (event: SelectChangeEvent) => {
    setInvalid(false);
    setSelectedCreditLimit(
      event.target.value as
        | CreditAccountLimitType
        | typeof EMPTY_CREDIT_ACCOUNT_LIMIT_SELECT,
    );
  };

  const { mutateAsync, isPending: creditAccountCreationPending } =
    useCreateCreditAccountMutation();

  const isActionSuccessful = (status: number) => {
    return status === 201;
  };

  const handleCreateCreditAccount = async () => {
    if (selectedCreditLimit !== EMPTY_CREDIT_ACCOUNT_LIMIT_SELECT) {
      setInvalid(false);
      const { status } = await mutateAsync({
        companyId,
        creditLimit: selectedCreditLimit,
      });
      if (isActionSuccessful(status)) {
        // Reload all credit account data.
        queryClient.refetchQueries({
          predicate: (query) => query.queryKey[0] === "credit-account",
        });
      } else {
        console.error(`${status}: Failed to create credit account.`);
      }
    } else {
      setInvalid(true);
    }
  };

  return (
    <Box>
      <Typography variant="h3" className="credit-account-page__title">
        Add Credit Account
      </Typography>
      <Box className="add-credit-account-action">
        <Box>
          <SelectCreditLimit
            value={selectedCreditLimit}
            label={"Credit Limit"}
            onChange={handleSelectedCreditLimit}
            menuItems={CREDIT_ACCOUNT_LIMIT_CHOOSE_FROM_OPTIONS.map((data) => (
              <MenuItem key={data.value} value={data.value}>
                {data.label}
              </MenuItem>
            ))}
            invalid={invalid}
          />
        </Box>
        <Button
          className={`add-credit-account-action__btn ${invalid && "add-credit-account-action__btn--error"}`}
          variant="contained"
          onClick={handleCreateCreditAccount}
          disabled={creditAccountCreationPending}
        >
          Add Credit Account
        </Button>
      </Box>
    </Box>
  );
};
