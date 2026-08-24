import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ONROUTE_WEBPAGE_LINKS } from "../../../../../../../../routes/constants";
import { OverloadCalculationDetails } from "./OverloadCalculationDetails";

describe("OverloadCalculationDetails", () => {
  it("shows the selected axle rows with formatted values and can collapse", async () => {
    const user = userEvent.setup();
    render(
      <OverloadCalculationDetails
        overload={8360}
        details={[
          {
            kind: "axle-weight",
            startAxleUnit: 1,
            endAxleUnit: 1,
            actualWeight: 7560,
            legalMaxWeight: 7300,
            overload: 260,
          },
          {
            kind: "axle-weight",
            startAxleUnit: 3,
            endAxleUnit: 4,
            actualWeight: 35100,
            legalMaxWeight: 31000,
            overload: 4100,
          },
        ]}
      />,
    );

    expect(
      screen.getByRole("columnheader", { name: "Actual (kg)" }),
    ).toBeVisible();
    expect(
      screen.getByRole("columnheader", { name: "Legal Max. (kg)" }),
    ).toBeVisible();
    expect(
      screen.queryByRole("columnheader", { name: "LGVW (kg)" }),
    ).toBeNull();

    const rangeRow = screen.getByText("3 - 4").closest("tr");
    expect(rangeRow).not.toBeNull();
    expect(
      within(rangeRow as HTMLTableRowElement).getByText("35,100"),
    ).toBeVisible();
    expect(
      within(rangeRow as HTMLTableRowElement).getByText("31,000"),
    ).toBeVisible();
    expect(screen.getByText("8,360")).toBeVisible();
    expect(screen.getByText(/Total \(kg\): 8,360/)).toBeVisible();

    const regulationsLink = screen.getByRole("link", {
      name: "Commercial Transport Regulations",
    });
    expect(regulationsLink).toHaveAttribute(
      "href",
      ONROUTE_WEBPAGE_LINKS.COMMERCIAL_TRANSPORT_REGULATIONS,
    );
    expect(screen.getByText(/Toll-free: 1-800-559-9688/)).toBeVisible();
    expect(screen.getByText(/Email: ppcpermit@gov.bc.ca/)).toBeVisible();

    const toggle = screen.getByRole("button", { name: "Overload Details" });
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.queryByRole("columnheader", { name: "Actual (kg)" }),
    ).toBeNull();
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("shows only the licensed-GVW column set for a licensed overload", () => {
    render(
      <OverloadCalculationDetails
        overload={17000}
        details={[
          {
            kind: "licensed-gvw",
            startAxleUnit: 1,
            endAxleUnit: 3,
            licensedGVW: 35000,
            totalGCVW: 52000,
            overload: 17000,
          },
        ]}
      />,
    );

    expect(
      screen.getByRole("columnheader", { name: "LGVW (kg)" }),
    ).toBeVisible();
    expect(
      screen.getByRole("columnheader", { name: "Total GCVW (kg)" }),
    ).toBeVisible();
    expect(
      screen.queryByRole("columnheader", { name: "Actual (kg)" }),
    ).toBeNull();
    expect(screen.getByText("1 - 3")).toBeVisible();
    expect(screen.getByText("35,000")).toBeVisible();
    expect(screen.getByText("52,000")).toBeVisible();
  });
});
