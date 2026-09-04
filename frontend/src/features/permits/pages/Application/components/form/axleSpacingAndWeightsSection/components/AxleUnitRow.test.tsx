import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { AxleUnit } from "../../../../../../types/AxleUnit";
import { AxleUnitRow } from "./AxleUnitRow";

const axleConfiguration: AxleUnit[] = [
  {
    numberOfAxles: 1,
    numberOfTires: 2,
    tireSize: 279,
    axleSpread: null,
    axleUnitWeight: null,
  },
  { interaxleSpacing: null },
  {
    numberOfAxles: 1,
    numberOfTires: 2,
    tireSize: 279,
    axleSpread: null,
    axleUnitWeight: null,
  },
];

const renderAxleUnitRow = ({
  configuration = axleConfiguration,
  onUpdateAxleConfiguration = vi.fn(),
}: {
  configuration?: AxleUnit[];
  onUpdateAxleConfiguration?: (configuration: AxleUnit[]) => void;
} = {}) => {
  render(
    <table>
      <tbody>
        <AxleUnitRow
          axleConfiguration={configuration}
          label="Truck Tractor"
          axleUnitNumber={0}
          isTrailer={false}
          onUpdateAxleConfiguration={onUpdateAxleConfiguration}
          tireSizeOptions={[{ name: '279.4 (11")', size: 279 }]}
          canAddAxleUnits={false}
          readOnly={false}
        />
      </tbody>
    </table>,
  );
};

describe("AxleUnitRow", () => {
  it("selects an axle type by keyboard and updates the numeric axle and wheel values", async () => {
    const user = userEvent.setup();
    const onUpdateAxleConfiguration = vi.fn();
    renderAxleUnitRow({ onUpdateAxleConfiguration });

    const firstAxleTypeInput = screen.getAllByDisplayValue("Single")[0];
    await user.click(firstAxleTypeInput);

    expect(screen.getByRole("option", { name: "Single" })).toBeVisible();
    expect(screen.getByRole("option", { name: "Tandem" })).toBeVisible();
    expect(screen.getByRole("option", { name: "Tridem" })).toBeVisible();

    await user.keyboard("{End}{ArrowUp}{Enter}");

    expect(onUpdateAxleConfiguration).toHaveBeenCalledWith([
      {
        ...axleConfiguration[0],
        numberOfAxles: 2,
        numberOfTires: 4,
      },
      axleConfiguration[1],
      axleConfiguration[2],
    ]);
  });

  it("sets the minimum wheel count and clears axle spread when Single is selected", async () => {
    const user = userEvent.setup();
    const onUpdateAxleConfiguration = vi.fn();
    const configuration: AxleUnit[] = [
      {
        ...axleConfiguration[0],
        numberOfAxles: 3,
        numberOfTires: 6,
        axleSpread: 1.5,
      },
      axleConfiguration[1],
      axleConfiguration[2],
    ];
    renderAxleUnitRow({ configuration, onUpdateAxleConfiguration });

    await user.click(screen.getByDisplayValue("Tridem"));
    await user.click(screen.getByRole("option", { name: "Single" }));

    expect(onUpdateAxleConfiguration).toHaveBeenCalledWith([
      {
        ...configuration[0],
        numberOfAxles: 1,
        numberOfTires: 2,
        axleSpread: null,
      },
      configuration[1],
      configuration[2],
    ]);
  });
});
