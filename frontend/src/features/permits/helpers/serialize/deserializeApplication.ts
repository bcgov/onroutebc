import { Dayjs } from "dayjs";

import { applyWhenNotNullable } from "../../../../common/helpers/util";
import { Application, ApplicationResponseData } from "../../types/application";
import { getDurationOrDefault } from "../getDefaultApplicationFormData";
import { getExpiryDate } from "../permitState";
import { minDurationForPermitType } from "../dateSelection";
import { isQuarterlyPermit } from "../../types/PermitType";
import {
  getEndOfDate,
  getStartOfDate,
  now,
  toLocalDayjs,
  utcToLocalDayjs,
} from "../../../../common/helpers/formatDate";
import { AxleUnit } from "../../../bridgeFormulaCalculationTool/types/AxleUnit";

/**
 * Deserializes an ApplicationResponseData object (received from backend) to an Application object
 * @param response ApplicationResponseData object received as response data from backend
 * @returns Deserialized Application object that can be used by form fields and the front-end app
 */
export const deserializeApplicationResponse = (
  response: ApplicationResponseData,
): Application => {
  const startDateOrDefault = applyWhenNotNullable(
    (datetimeStr: string): Dayjs => getStartOfDate(toLocalDayjs(datetimeStr)),
    response.permitData.startDate,
    getStartOfDate(now()),
  );

  const permitType = response.permitType;
  const durationOrDefault = getDurationOrDefault(
    minDurationForPermitType(permitType),
    response.permitData.permitDuration,
  );

  const expiryDateOrDefault = applyWhenNotNullable(
    (datetimeStr: string): Dayjs => getEndOfDate(toLocalDayjs(datetimeStr)),
    response.permitData.expiryDate,
    getExpiryDate(
      startDateOrDefault,
      isQuarterlyPermit(response.permitType),
      durationOrDefault,
    ),
  );

  const unmergeInteraxleSpacingRows = (
    axleConfiguration: AxleUnit[],
    startIndex: number,
  ) => {
    const unmerged = axleConfiguration.map((axle) => ({ ...axle }));

    for (let i = startIndex; i < unmerged.length; i++) {
      const spacing = unmerged[i].interaxleSpacing ?? null;
      unmerged.splice(i, 0, { interaxleSpacing: spacing });

      // remove spacing value from the axle row since it now lives in the inserted spacing row
      unmerged[i + 1].interaxleSpacing = null;

      i++; // skip over the axle row we just processed
    }

    return unmerged;
  };

  return {
    ...response,
    createdDateTime: applyWhenNotNullable(
      (datetimeStr: string): Dayjs => utcToLocalDayjs(datetimeStr),
      response.createdDateTime,
    ),
    updatedDateTime: applyWhenNotNullable(
      (datetimeStr: string): Dayjs => utcToLocalDayjs(datetimeStr),
      response.updatedDateTime,
    ),
    permitData: {
      ...response.permitData,
      startDate: startDateOrDefault,
      expiryDate: expiryDateOrDefault,
      vehicleConfiguration: {
        ...response.permitData.vehicleConfiguration,
        axleConfiguration: response?.permitData?.vehicleConfiguration
          ?.axleConfiguration
          ? unmergeInteraxleSpacingRows(
              [...response.permitData.vehicleConfiguration.axleConfiguration],
              1,
            )
          : null,
        trailers: response?.permitData?.vehicleConfiguration?.trailers
          ? response.permitData.vehicleConfiguration.trailers.map(
              (trailer) => ({
                ...trailer,
                axleConfiguration: trailer?.axleConfiguration
                  ? unmergeInteraxleSpacingRows(
                      [...trailer.axleConfiguration],
                      0,
                    )
                  : null,
              }),
            )
          : null,
      },
    },
  };
};
