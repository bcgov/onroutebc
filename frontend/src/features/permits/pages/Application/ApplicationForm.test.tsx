import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PropsWithChildren } from "react";
import { describe, expect, it, beforeEach, vi } from "vitest";

import OnRouteBCContext from "../../../../common/authentication/OnRouteBCContext";
import { IDIR_USER_ROLE } from "../../../../common/authentication/types";
import { APPLICATION_STEP_CONTEXTS } from "../../../../routes/constants";
import { getDefaultValues } from "../../helpers/getDefaultApplicationFormData";
import { useInitApplicationFormData } from "../../hooks/form/useInitApplicationFormData";
import {
  POLICY_CHECK_ID_TYPES,
  AxleCalculationResult,
} from "../../types/AxleCalculationResult";
import { PERMIT_TYPES, PermitType } from "../../types/PermitType";
import { ApplicationForm } from "./ApplicationForm";

const mocks = vi.hoisted(() => ({
  navigate: vi.fn(),
  policyValidate: vi.fn(),
  saveApplication: vi.fn(),
  handleSaveVehicle: vi.fn(),
}));

vi.mock("react-router-dom", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react-router-dom")>()),
  useNavigate: () => mocks.navigate,
}));

vi.mock("../../hooks/form/useInitApplicationFormData", () => ({
  useInitApplicationFormData: vi.fn(),
}));

vi.mock("../../hooks/hooks", () => ({
  useSaveApplicationMutation: () => ({
    mutateAsync: mocks.saveApplication,
  }),
}));

vi.mock("../../hooks/usePermitVehicleManagement", () => ({
  usePermitVehicleManagement: () => ({
    handleSaveVehicle: mocks.handleSaveVehicle,
    allVehiclesFromInventory: [],
    powerUnitSubtypeNamesMap: new Map(),
    trailerSubtypeNamesMap: new Map(),
  }),
}));

vi.mock("../../../manageProfile/apiManager/hooks", () => ({
  useCompanyInfoDetailsQuery: () => ({ data: undefined }),
}));

vi.mock("../../../settings/hooks/LOA", () => ({
  useFetchLOAs: () => ({ data: [] }),
}));

vi.mock("../../../settings/hooks/specialAuthorizations", () => ({
  useFetchSpecialAuthorizations: () => ({ data: undefined }),
}));

vi.mock("../../../policy/hooks/usePolicyEngine", () => ({
  usePolicyEngine: () => ({ validate: mocks.policyValidate }),
}));

vi.mock("../../../queue/hooks/hooks", () => ({
  useApplicationInQueueMetadata: () => ({
    refetch: vi.fn(),
  }),
}));

vi.mock(
  "../../components/application-breadcrumb/ApplicationBreadcrumb",
  () => ({ ApplicationBreadcrumb: () => null }),
);

vi.mock("../../components/dialog/LeaveApplicationDialog", () => ({
  LeaveApplicationDialog: () => null,
}));

vi.mock("../../../queue/components/UnavailableApplicationModal", () => ({
  UnavailableApplicationModal: () => null,
}));

vi.mock("./components/form/PermitForm", async () => {
  const { useContext } = await import("react");
  const { ApplicationFormContext } = await import(
    "../../context/ApplicationFormContext"
  );

  return {
    PermitForm: () => {
      const { onContinue } = useContext(ApplicationFormContext);
      return <button onClick={() => void onContinue()}>Continue</button>;
    },
  };
});

const createAxleCalculationResults = (
  overrides: Partial<AxleCalculationResult> = {},
): AxleCalculationResult => ({
  results: [],
  overload: 0,
  totalGCVW: 4500,
  ...overrides,
});

const validAxleConfiguration = [
  {
    numberOfAxles: 1,
    axleSpread: null,
    interaxleSpacing: null,
    axleUnitWeight: 1000,
    numberOfTires: 4,
    tireSize: 279,
  },
  { interaxleSpacing: 5 },
  {
    numberOfAxles: 1,
    axleSpread: null,
    interaxleSpacing: null,
    axleUnitWeight: 1000,
    numberOfTires: 4,
    tireSize: 279,
  },
];

const createFormData = (permitType: PermitType = PERMIT_TYPES.STOW) => {
  const formData = getDefaultValues(permitType, undefined);
  formData.permitData.vehicleConfiguration = {
    ...formData.permitData.vehicleConfiguration,
    axleConfiguration: validAxleConfiguration,
  };
  return formData;
};

const mockFormData = (formData: ReturnType<typeof createFormData>) => {
  vi.mocked(useInitApplicationFormData).mockReturnValue({
    initialFormData: formData,
    currentFormData: formData,
    formMethods: {
      handleSubmit: (handler: (data: typeof formData) => Promise<void>) => () =>
        handler(formData),
    },
  } as ReturnType<typeof useInitApplicationFormData>);
};

const renderApplicationForm = (
  isStaff = false,
  permitType: PermitType = PERMIT_TYPES.STOW,
) => {
  const contextValue = isStaff
    ? {
        idirUserDetails: {
          firstName: "Permit",
          lastName: "Clerk",
          userName: "pclerk",
          email: "pclerk@example.com",
          userRole: IDIR_USER_ROLE.PPC_CLERK,
        },
      }
    : {};

  const ContextProvider = ({ children }: PropsWithChildren) => (
    <OnRouteBCContext.Provider value={contextValue}>
      {children}
    </OnRouteBCContext.Provider>
  );

  return render(
    <ApplicationForm
      permitType={permitType}
      companyId={1}
      applicationStepContext={APPLICATION_STEP_CONTEXTS.APPLY}
      isCopiedApplication={false}
    />,
    { wrapper: ContextProvider },
  );
};

describe("ApplicationForm permit-not-required handling", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    const formData = createFormData();
    mockFormData(formData);

    mocks.handleSaveVehicle.mockResolvedValue({});
    mocks.saveApplication.mockResolvedValue(undefined);
  });

  it("shows the modal and does not save or navigate for a staff user", async () => {
    const user = userEvent.setup();
    mocks.policyValidate.mockResolvedValue({
      violations: [],
      axleCalculationResults: createAxleCalculationResults(),
    });
    renderApplicationForm(true);

    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(
      await screen.findByRole("heading", {
        name: "This permit type is not required",
      }),
    ).toBeVisible();
    expect(mocks.handleSaveVehicle).not.toHaveBeenCalled();
    expect(mocks.saveApplication).not.toHaveBeenCalled();
    expect(mocks.navigate).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Close" }));
    await waitForElementToBeRemoved(() =>
      screen.queryByRole("heading", {
        name: "This permit type is not required",
      }),
    );
  });

  it("continues through the existing save flow when an overload requires the permit", async () => {
    const user = userEvent.setup();

    mocks.policyValidate.mockResolvedValue({
      violations: [],
      axleCalculationResults: createAxleCalculationResults({ overload: 100 }),
    });
    renderApplicationForm();

    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(mocks.handleSaveVehicle).toHaveBeenCalledOnce();
    expect(mocks.saveApplication).toHaveBeenCalledOnce();
    expect(
      screen.queryByRole("heading", {
        name: "This permit type is not required",
      }),
    ).not.toBeInTheDocument();
  });

  it("retains the existing validation stop when an axle calculation fails", async () => {
    const user = userEvent.setup();
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    mocks.policyValidate.mockResolvedValue({
      violations: [],
      axleCalculationResults: createAxleCalculationResults({
        results: [
          {
            id: POLICY_CHECK_ID_TYPES.BRIDGE_FORMULA,
            result: "fail",
            message: "Bridge calculation failed.",
            startAxleUnit: 1,
            endAxleUnit: 2,
          },
        ],
      }),
    });
    renderApplicationForm();

    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(mocks.handleSaveVehicle).not.toHaveBeenCalled();
    expect(mocks.saveApplication).not.toHaveBeenCalled();
    expect(mocks.navigate).not.toHaveBeenCalled();
    expect(
      screen.queryByRole("heading", {
        name: "This permit type is not required",
      }),
    ).not.toBeInTheDocument();
    consoleError.mockRestore();
  });

  it("continues STOS applications without requiring hidden ASW fields", async () => {
    const user = userEvent.setup();
    const formData = createFormData(PERMIT_TYPES.STOS);
    formData.permitData.vehicleConfiguration = {
      ...formData.permitData.vehicleConfiguration,
      axleConfiguration: [
        {
          numberOfAxles: 1,
          numberOfTires: null,
          tireSize: 279,
          axleSpread: null,
          axleUnitWeight: null,
          interaxleSpacing: null,
        },
      ],
    };
    mockFormData(formData);
    mocks.policyValidate.mockResolvedValue({
      violations: [],
      axleCalculationResults: createAxleCalculationResults(),
    });

    renderApplicationForm(false, PERMIT_TYPES.STOS);
    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(mocks.policyValidate).toHaveBeenCalledOnce();
    expect(mocks.handleSaveVehicle).toHaveBeenCalledOnce();
    expect(mocks.saveApplication).toHaveBeenCalledOnce();
  });
});
