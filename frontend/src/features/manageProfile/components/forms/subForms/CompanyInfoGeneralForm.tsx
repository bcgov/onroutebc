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
        rules: {
          required: { value: true, message: "Address is required" },
        },
        label: "Address (Line 1)",
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
          rules: {
            required: { value: true, message: "City is required" },
          },
          label: "City",
          width: CITY_WIDTH,
        }}
      />
      <CustomFormComponent
        type="input"
        feature={feature}
        options={{
          name: "companyAddress.postalCode",
          rules: {
            required: { value: true, message: "Postal / Zip Code is required" },
          },
          label: "Postal / Zip Code",
          width: POSTAL_WIDTH,
        }}
      />
    </div>
  </>
);
