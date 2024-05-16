import { useMutation } from "@tanstack/react-query";
import { createCreditAccount } from '../apiManager/creditAccount'

/**
 * Hook to create a credit account.
 * @returns Result of the create credit account action
 */
export const useCreateCreditAccountMutation = () => {
    return useMutation({
      mutationFn: createCreditAccount,
    });
  };