import { render } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import dayjs, { Dayjs } from "dayjs";
import userEvent from "@testing-library/user-event";
import { Options } from "@testing-library/user-event/dist/types/options";

import { now } from "../../../../../../../common/helpers/formatDate";
import { TROS_COMMODITIES } from "../../../../../constants/termOversizeConstants";
import { PermitDetails } from "../../PermitDetails";
import { Commodities } from "../../../../../types/application";

const feature = "testfeature";
export const currentDt = now();
export const tomorrow = dayjs(currentDt).add(1, "day");
export const day = currentDt.date();
export const thisMonth = currentDt.month();
export const daysInCurrMonth = currentDt.daysInMonth();
export const tomorrowDay = tomorrow.date();
export const maxFutureDate = dayjs(currentDt).add(14, "day");
export const maxFutureMonth = maxFutureDate.month();
export const maxFutureDay = maxFutureDate.date();
export const daysInFutureMonth = maxFutureDate.daysInMonth();

export const commodities = [...TROS_COMMODITIES];
export const defaultDuration = 30;
export const emptyCommodities: Commodities[] = [];
export const allDurations = [
  {text: "30 Days", days: 30},
  {text: "60 Days", days: 60},
  {text: "90 Days", days: 90},
  {text: "120 Days", days: 120},
  {text: "150 Days", days: 150},
  {text: "180 Days", days: 180},
  {text: "210 Days", days: 210},
  {text: "240 Days", days: 240},
  {text: "270 Days", days: 270},
  {text: "300 Days", days: 300},
  {text: "330 Days", days: 330},
  {text: "1 Year", days: 365},
];

export const requiredCommodityIndices = commodities
  .map((commodity, i) => 
    commodity.condition === "CVSE-1000" || commodity.condition === "CVSE-1070" ? i : -1
  ).filter(i => i >= 0);

const TestFormWrapper = (props: React.PropsWithChildren) => {
  const formMethods = useForm({
    defaultValues: {
      permitData: {
        startDate: currentDt,
        permitDuration: 30,
        expiryDate: currentDt,
        commodities: [],
      }
    },
    reValidateMode: "onBlur",
  });

  return (
    <FormProvider {...formMethods}>
      {props.children}
    </FormProvider>
  );
};

export const renderTestComponent = (startDate: Dayjs, duration: number, commodities: Commodities[], userEventOptions?: Options) => {
  const user = userEvent.setup(userEventOptions);
  const renderedComponent = render(
    <TestFormWrapper>
      <PermitDetails
        feature={feature}
        defaultStartDate={startDate}
        defaultDuration={duration}
        commodities={commodities}
      />
    </TestFormWrapper>
  );

  return { user, renderedComponent };
};

export const renderDefaultTestComponent = (userEventOptions?: Options) => {
  return renderTestComponent(currentDt, defaultDuration, emptyCommodities, userEventOptions);
};
