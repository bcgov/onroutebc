import { Dayjs } from "dayjs";
import { getDefaultRequiredVal } from "../../../../../../common/helpers/util";
import { dayjsToUtcStr } from "../../../../../../common/helpers/formatDate";
import { PermitHistory } from "../../../../types/PermitHistory";

export const getRevisionHistory = (
  permitHistory: PermitHistory[],
  currentDate: Dayjs,
) =>
  permitHistory
    .filter((history) => history.comment && history.transactionSubmitDate)
    .map((history) => ({
      permitId: history.permitId,
      comment: getDefaultRequiredVal("", history.comment),
      name: history.commentUsername,
      revisionDateTime: getDefaultRequiredVal(
        dayjsToUtcStr(currentDate),
        history.transactionSubmitDate,
      ),
    }));
