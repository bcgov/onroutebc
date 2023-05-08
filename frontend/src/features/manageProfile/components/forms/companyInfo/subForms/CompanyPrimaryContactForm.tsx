import { CountryAndProvince } from "../../../../../../common/components/form/CountryAndProvince";
import { CustomFormComponent } from "../../../../../../common/components/form/CustomFormComponents";
import {
  PHONE_WIDTH,
  EXT_WIDTH,
  CITY_WIDTH,
} from "../../../../../../themes/bcGovStyles";

export const CompanyPrimaryContactForm = ({ feature }: { feature: string }) => (
  <>
    <CustomFormComponent
      type="input"
      feature={feature}
      options={{
        name: "primaryContact.firstName",
        rules: {
          required: { value: true, message: "First Name is required" },
        },
        label: "First Name",
      }}
    />
    <CustomFormComponent
      type="input"
      feature={feature}
      options={{
        name: "primaryContact.lastName",
        rules: {
          required: { value: true, message: "Last Name is required" },
        },
        label: "Last Name",
      }}
    />
    <CustomFormComponent
      type="input"
      feature={feature}
      options={{
        name: "primaryContact.email",
        rules: {
          required: { value: true, message: "Email is required" },
        },
        label: "Email",
      }}
    />

    <div className="mp-side-by-side-container">
      <CustomFormComponent
        type="phone"
        feature={feature}
        options={{
          name: "primaryContact.phone1",
          rules: {
            required: { value: true, message: "Phone Number is required" },
          },
          label: "Phone Number",
          width: PHONE_WIDTH,
        }}
      />
      <CustomFormComponent
        type="input"
        feature={feature}
        options={{
          name: "primaryContact.phone1Extension",
          rules: { required: false },
          label: "Ext",
          width: EXT_WIDTH,
        }}
      />
    </div>
    <div className="mp-side-by-side-container">
      <CustomFormComponent
        type="phone"
        feature={feature}
        options={{
          name: "primaryContact.phone2",
          rules: { required: false },
          label: "Alternate Number",
          width: PHONE_WIDTH,
        }}
      />
      <CustomFormComponent
        type="input"
        feature={feature}
        options={{
          name: "primaryContact.phone2Extension",
          rules: { required: false },
          label: "Ext",
          width: EXT_WIDTH,
        }}
      />
    </div>

    <CountryAndProvince
      feature={feature}
      countryField="primaryContact.countryCode"
      isCountryRequired={true}
      provinceField="primaryContact.provinceCode"
      isProvinceRequired={true}
    />
    <CustomFormComponent
      type="input"
      feature={feature}
      options={{
        name: "primaryContact.city",
        rules: {
          required: { value: true, message: "City is required" },
        },
        label: "City",
        width: CITY_WIDTH,
      }}
    />
  </>
);
