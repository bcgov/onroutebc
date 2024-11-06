import { useMutation } from "@tanstack/react-query";
import { refundPermit } from "../api/api";

export const useRefundPermitMutation = () => {
  return useMutation({
    mutationFn: refundPermit,
  });
};
