import { render } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import dayjs, { Dayjs } from "dayjs";
import userEvent from "@testing-library/user-event";
import { Options } from "@testing-library/user-event/dist/types/options";

import { DEFAULT_PERMIT_TYPE } from "../../../../../../types/PermitType";
import { getDefaultCommodities, getMandatoryCommodities } from "../../../../../../helpers/commodities";
import { PermitDetails } from "../../PermitDetails";
import { getExpiryDate } from "../../../../../../helpers/permitState";
import { PermitCommodity } from "../../../../../../types/PermitCommodity";
import {
  getStartOfDate,
  now,
} from "../../../../../../../../common/helpers/formatDate";

const feature = "testfeature";
export const currentDt = getStartOfDate(now());
export const tomorrow = dayjs(currentDt).add(1, "day");
export const day = currentDt.date();
export const thisMonth = currentDt.month();
export const thisYear = currentDt.year();
export const daysInCurrMonth = currentDt.daysInMonth();
export const tomorrowDay = tomorrow.date();
export const maxFutureDate = dayjs(currentDt).add(14, "day");
export const maxFutureMonth = maxFutureDate.month();
export const maxFutureYear = maxFutureDate.year();
export const maxFutureDay = maxFutureDate.date();
export const daysInFutureMonth = maxFutureDate.daysInMonth();

export const commodities = getDefaultCommodities(DEFAULT_PERMIT_TYPE);
export const defaultDuration = 30;
export const emptyCommodities: PermitCommodity[] = [];
export const allDurations = [
  { text: "30 Days", days: 30 },
  { text: "60 Days", days: 60 },
  { text: "90 Days", days: 90 },
  { text: "120 Days", days: 120 },
  { text: "150 Days", days: 150 },
  { text: "180 Days", days: 180 },
  { text: "210 Days", days: 210 },
  { text: "240 Days", days: 240 },
  { text: "270 Days", days: 270 },
  { text: "300 Days", days: 300 },
  { text: "330 Days", days: 330 },
  { text: "1 Year", days: 365 },
];

const mandatoryConditions = getMandatoryCommodities(DEFAULT_PERMIT_TYPE).map(commodity => commodity.condition);
export const requiredCommodityIndices = commodities
  .map((commodity, i) =>
    mandatoryConditions.includes(commodity.condition)
      ? i
      : -1,
  )
  .filter((i) => i >= 0);

const TestFormWrapper = (props: React.PropsWithChildren) => {
  const formMethods = useForm({
    defaultValues: {
      permitData: {
        startDate: currentDt,
        permitDuration: 30,
        expiryDate: getExpiryDate(currentDt, 30),
        commodities: [],
      },
    },
    reValidateMode: "onBlur",
  });

  return <FormProvider {...formMethods}>{props.children}</FormProvider>;
};

export const renderTestComponent = (
  startDate: Dayjs,
  duration: number,
  commodities: PermitCommodity[],
  userEventOptions?: Options,
) => {
  const user = userEvent.setup(userEventOptions);
  const renderedComponent = render(
    <TestFormWrapper>
      <PermitDetails
        feature={feature}
        defaultStartDate={startDate}
        defaultDuration={duration}
        commoditiesInPermit={commodities}
        durationOptions={allDurations.map((duration) => ({
          label: duration.text,
          value: duration.days,
        }))}
        disableStartDate={false}
        permitType={DEFAULT_PERMIT_TYPE}
      />
    </TestFormWrapper>,
  );

  return { user, renderedComponent };
};

export const renderDefaultTestComponent = (userEventOptions?: Options) => {
  return renderTestComponent(
    currentDt,
    defaultDuration,
    emptyCommodities,
    userEventOptions,
  );
};
