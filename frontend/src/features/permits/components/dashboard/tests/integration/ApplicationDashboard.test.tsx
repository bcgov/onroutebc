import { formatPhoneNumber } from "../../../../../../common/components/form/subFormComponents/PhoneNumberInput";
import { resetVehicleSource } from "./fixtures/getVehicleInfo";
import { getEmptyUserDetails } from "./fixtures/getUserDetails";
import { resetApplicationSource } from "./fixtures/getActiveApplication";
import { DATE_FORMATS, dayjsToLocalStr, utcToLocalDayjs } from "../../../../../../common/helpers/formatDate";
import { closeMockServer, companyInfo, defaultUserDetails, listenToMockServer, newApplicationNumber, renderTestComponent, resetMockServer } from "./helpers/prepare";
import { getDefaultRequiredVal } from "../../../../../../common/helpers/util";
import { 
  applicationCreatedDateDisplay,
  applicationNumberDisplay,
  applicationUpdatedDateDisplay,
  companyClientNumberDisplay,
  companyNameDisplay,
  continueApplication,
  errMsgForEmail,
  errMsgForFirstName,
  errMsgForLastName,
  errMsgForPhone1,
  getSavedApplication,
  inputWithValue, replaceValueForInput, saveApplication, sendPermitToEmailMsg,
} from "./helpers/access";

const {
  firstName,
  lastName,
  phone1,
  phone1Extension,
  phone2,
  phone2Extension,
  email,
  fax,
} = defaultUserDetails.userDetails;

beforeAll(() => {
  resetVehicleSource();
  resetApplicationSource();
  listenToMockServer();
});

beforeEach(async () => {
  resetVehicleSource();
  resetApplicationSource();
  vi.resetModules();
});

afterEach(() => {
  resetMockServer();
});

afterAll(() => {
  closeMockServer();
});

describe("Application Contact Details", () => {
  it("should properly display Contact Details", async () => {
    // Arrange and Act
    renderTestComponent(defaultUserDetails);

    // Assert - should show proper info for the default user details passed in
    expect(await inputWithValue(firstName)).toBeVisible();
    expect(await inputWithValue(lastName)).toBeVisible();
    expect(await inputWithValue(phone1)).toBeVisible();
    expect(await inputWithValue(phone1Extension)).toBeVisible();
    expect(await inputWithValue(phone2)).toBeVisible();
    expect(await inputWithValue(phone2Extension)).toBeVisible();
    expect(await inputWithValue(email)).toBeVisible();
    expect(await inputWithValue(fax)).toBeVisible();
    expect(await sendPermitToEmailMsg()).toBeInTheDocument();
  });

  it("should properly edit Contact Details", async () => {
    // Arrange
    const { user } = renderTestComponent(defaultUserDetails);

    const firstNameInput = await inputWithValue(firstName);
    const lastNameInput = await inputWithValue(lastName);
    const phone1Input = await inputWithValue(phone1);
    const phone1ExtInput = await inputWithValue(phone1Extension);
    const phone2Input = await inputWithValue(phone2);
    const phone2ExtInput = await inputWithValue(phone2Extension);
    const emailInput = await inputWithValue(email);
    const faxInput = await inputWithValue(fax);

    // Act - change various input field values and save application
    const newFirstName = "Myfirstname";
    await replaceValueForInput(user, firstNameInput, firstName.length, newFirstName);
    const newLastName = "Mylastname";
    await replaceValueForInput(user, lastNameInput, lastName.length, newLastName);
    const newPhone1 = formatPhoneNumber("778-123-4567");
    await replaceValueForInput(user, phone1Input, phone1.length, newPhone1);
    const newPhone2 = formatPhoneNumber("778-123-4568");
    await replaceValueForInput(user, phone2Input, phone2.length, newPhone2);
    const newEmail = "mc@mycompany.co";
    await replaceValueForInput(user, emailInput, email.length, newEmail);
    await saveApplication(user);

    // Assert - input fields should contain updated values
    await getSavedApplication();
    expect(firstNameInput).toHaveValue(newFirstName);
    expect(lastNameInput).toHaveValue(newLastName);
    expect(phone1Input).toHaveValue(newPhone1);
    expect(phone1ExtInput).toHaveValue(phone1Extension);
    expect(phone2Input).toHaveValue(newPhone2);
    expect(phone2ExtInput).toHaveValue(phone2Extension);
    expect(emailInput).toHaveValue(newEmail);
    expect(faxInput).toHaveValue(fax);
    expect(await sendPermitToEmailMsg()).toBeInTheDocument();
  });

  it("should show validation errors when submitting empty contact details", async () => {
    // Arrange
    const emptyUserDetails = getEmptyUserDetails();
    const { user } = renderTestComponent(emptyUserDetails);

    // Act - click 'continue' when contact details fields are empty
    await continueApplication(user);

    // Assert - error messages should be displayed
    const requiredMsg = "This is a required field."
    expect(await errMsgForFirstName()).toHaveTextContent(requiredMsg);
    expect(await errMsgForLastName()).toHaveTextContent(requiredMsg);
    expect(await errMsgForPhone1()).toHaveTextContent(requiredMsg);
    expect(await errMsgForEmail()).toHaveTextContent(requiredMsg);
  });
});

describe("Application Header", () => {
  it("should display application number after creating application", async () => {
    // Arrange
    const { user } = renderTestComponent(defaultUserDetails);

    // Act
    await saveApplication(user);

    // Assert
    const applicationData = await getSavedApplication();
    const expectedApplicationNumber = getDefaultRequiredVal(
      newApplicationNumber,
      applicationData?.applicationNumber,
    );
    expect(await applicationNumberDisplay()).toHaveTextContent(expectedApplicationNumber);
  });

  it("should display proper created datetime after creating application", async () => {
    // Arrange
    const { user } = renderTestComponent(defaultUserDetails);

    // Act
    await saveApplication(user);

    // Assert
    const applicationData = await getSavedApplication();
    const expectedCreatedDt = getDefaultRequiredVal(
      "",
      applicationData?.createdDateTime,
    );
    const formattedDt = dayjsToLocalStr(
      utcToLocalDayjs(expectedCreatedDt), 
      DATE_FORMATS.LONG
    );
    expect(await applicationCreatedDateDisplay()).toHaveTextContent(formattedDt);
  });

  it("should display proper updated datetime after updating application", async () => {
    // Arrange
    const { user } = renderTestComponent(defaultUserDetails);

    // Act
    await saveApplication(user);

    // Assert
    const applicationData = await getSavedApplication();
    const expectedUpdatedDt = getDefaultRequiredVal(
      "",
      applicationData?.updatedDateTime,
    );
    const formattedDt = dayjsToLocalStr(
      utcToLocalDayjs(expectedUpdatedDt), 
      DATE_FORMATS.LONG
    );
    expect(await applicationUpdatedDateDisplay()).toHaveTextContent(formattedDt);
  });

  it("should display company information", async () => {
    // Arrange and Act
    renderTestComponent(defaultUserDetails);

    // Assert
    const { legalName, clientNumber } = companyInfo;
    expect(await companyNameDisplay()).toHaveTextContent(legalName);
    expect(await companyClientNumberDisplay()).toHaveTextContent(clientNumber);
  });
});
