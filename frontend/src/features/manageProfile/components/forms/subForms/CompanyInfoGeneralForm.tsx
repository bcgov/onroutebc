import { CountryAndProvince } from "../../../../../common/components/form/CountryAndProvince";
import { CustomFormComponent } from "../../../../../common/components/form/CustomFormComponents";
import { CITY_WIDTH, POSTAL_WIDTH } from "../../../../../themes/bcGovStyles";

export const CompanyInfoGeneralForm = ({ feature }: { feature: string }) => (
  <>
    <CustomFormComponent
      type="input"
      feature={feature}
      options={{
        name: "companyAddress.addressLine1",
        rules: { required: true },
        label: "Address (Line 1)",
        inValidMessage: "Address is required",
      }}
    />

    <CustomFormComponent
      type="input"
      feature={feature}
      options={{
        name: "companyAddress.addressLine2",
        rules: { required: false },
        label: "Address (Line 2)",
      }}
    />

    <CountryAndProvince
      feature={feature}
      countryField="companyAddress.countryCode"
      provinceField="companyAddress.provinceCode"
    />

    <div className="mp-side-by-side-container">
      <CustomFormComponent
        type="input"
        feature={feature}
        options={{
          name: "companyAddress.city",
          rules: { required: true },
          label: "City",
          inValidMessage: "City is required",
          width: CITY_WIDTH,
        }}
      />
      <CustomFormComponent
        type="input"
        feature={feature}
        options={{
          name: "companyAddress.postalCode",
          rules: { required: true },
          label: "Postal / Zip Code",
          inValidMessage: "Postal / Zip Code is required",
          width: POSTAL_WIDTH,
        }}
      />
    </div>
  </>
);
