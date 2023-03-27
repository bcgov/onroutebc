import { memo } from "react";
import "../../../manageProfile/components/forms/CompanyInfoForms.scss";
import { CustomFormComponent } from "../../../../common/components/form/CustomFormComponents";
import { CountryAndProvince } from "../../../../common/components/form/CountryAndProvince";
import {
  EXT_WIDTH,
  PHONE_WIDTH,
} from "../../../../themes/bcGovStyles";

/**
 * The User Information Form contains multiple subs forms including
 * Company Info, Company Contact, Primary Contact, and Mailing Address Forms.
 * This Component contains the logic for React Hook forms and React query
 * for state management and API calls
 */
export const UserInformationWizardForm = memo(
  () => {

    const FEATURE = "wizard";

    return (
      <div className="mp-form-container">
          <>
            <CustomFormComponent
              type="input"
              feature={FEATURE}
              options={{
                name: "adminUser.firstName",
                rules: {
                  required: { value: true, message: "First Name is required" },
                },
                label: "First Name",
              }}
            />
            <CustomFormComponent
              type="input"
              feature={FEATURE}
              options={{
                name: "adminUser.lastName",
                rules: {
                  required: { value: true, message: "Last Name is required" },
                },
                label: "Last Name",
              }}
            />
            <CustomFormComponent
              type="input"
              feature={FEATURE}
              options={{
                name: "adminUser.email",
                rules: {
                  required: { value: true, message: "Email is required" },
                },
                label: "Email",
              }}
            />

            <div className="mp-side-by-side-container">
              <CustomFormComponent
                type="phone"
                feature={FEATURE}
                options={{
                  name: "adminUser.phone1",
                  rules: {
                    required: {
                      value: true,
                      message: "Phone Number is required",
                    },
                  },
                  label: "Primary Phone",
                  width: PHONE_WIDTH,
                }}
              />
              <CustomFormComponent
                type="input"
                feature={FEATURE}
                options={{
                  name: "adminUser.phone1Extension",
                  rules: { required: false },
                  label: "Ext",
                  width: EXT_WIDTH,
                }}
              />
            </div>
            <div className="mp-side-by-side-container">
              <CustomFormComponent
                type="phone"
                feature={FEATURE}
                options={{
                  name: "adminUser.phone2",
                  rules: { required: false },
                  label: "Alternate Phone",
                  width: PHONE_WIDTH,
                }}
              />
              <CustomFormComponent
                type="input"
                feature={FEATURE}
                options={{
                  name: "adminUser.phone2Extension",
                  rules: { required: false },
                  label: "Ext",
                  width: EXT_WIDTH,
                }}
              />
            </div>
            <CustomFormComponent
              type="input"
              feature={FEATURE}
              options={{
                name: "adminUser.fax",
                rules: { required: false },
                label: "Fax",
                width: PHONE_WIDTH,
              }}
            />
            <CountryAndProvince
              feature={FEATURE}
              countryField="adminUser.countryCode"
              isCountryRequired={true}
              provinceField="adminUser.provinceCode"
              isProvinceRequired={true}
            />
            <CustomFormComponent
              type="input"
              feature={FEATURE}
              options={{
                name: "adminUser.city",
                rules: {
                  required: { value: true, message: "City is required" },
                },
                label: "City",
              }}
            />
          </>
      </div>
    );
  }
);

UserInformationWizardForm.displayName = "UserInformationWizardForm";
