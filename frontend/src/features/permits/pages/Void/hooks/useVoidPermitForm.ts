import { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";

import { getDefaultRequiredVal } from "../../../../../common/helpers/util";
import { VoidPermitDto } from "../types/VoidPermitDto";
import { VoidPermitContext } from "../context/VoidPermitContext";

export const useVoidPermitForm = () => {
  const { 
    voidPermitData, 
    setVoidPermitData,
    next,
  } = useContext(VoidPermitContext);
  const [shouldRevoke, setShouldRevoke] = useState(voidPermitData.revoke);

  const defaultFormData = {
    permitId: voidPermitData.permitId,
    reason: getDefaultRequiredVal("", voidPermitData.reason),
    revoke: shouldRevoke,
    refund: voidPermitData.refund,
    email: getDefaultRequiredVal("", voidPermitData.email),
    fax: getDefaultRequiredVal("", voidPermitData.fax),
  };

  const formMethods = useForm<VoidPermitDto>({
    defaultValues: defaultFormData,
    reValidateMode: "onBlur",
  });

  const { setValue } = formMethods;

  useEffect(() => {
    setValue("email", getDefaultRequiredVal("", voidPermitData.email));
  }, [voidPermitData.email]);

  useEffect(() => {
    setValue("fax", getDefaultRequiredVal("", voidPermitData.fax));
  }, [voidPermitData.fax]);

  const handleReasonChange = (reason: string) => {
    setValue("reason", reason);
  };

  const handleRevokeChange = (revokeOption: string) => {
    const updatedRevoke = revokeOption === "true";
    setShouldRevoke(updatedRevoke);
    setValue("revoke", updatedRevoke);
    if (updatedRevoke) {
      handleRefundChange("false");
    }
  };

  const handleRefundChange = (refundOption: string) => {
    const updatedRefund = refundOption === "true";
    setValue("refund", updatedRefund);
  };

  return {
    shouldRevoke,
    formMethods,
    handleReasonChange,
    handleRevokeChange,
    handleRefundChange,
    setVoidPermitData,
    next,
  };
};
