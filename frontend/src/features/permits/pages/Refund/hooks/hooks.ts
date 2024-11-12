import { useMutation } from "@tanstack/react-query";
import { refundPermit } from "../api/api";
import { RefundPermitData } from "../types/RefundPermitData";

export const useRefundPermitMutation = () => {
  return useMutation({
    mutationFn: (data: RefundPermitData) => refundPermit(data),
  });
};
