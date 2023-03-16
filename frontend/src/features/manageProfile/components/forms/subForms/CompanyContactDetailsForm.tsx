import { CustomFormComponent } from "../../../../../common/components/form/CustomFormComponents";
import { PHONE_WIDTH, EXT_WIDTH } from "../../../../../themes/bcGovStyles";

export const CompanyContactDetailsForm = ({ feature }: { feature: string }) => (
  <>
    <CustomFormComponent
      type="input"
      feature={feature}
      options={{
        name: "email",
        rules: { required: false },
        label: "Email",
      }}
    />
    <div className="mp-side-by-side-container">
      <CustomFormComponent
        type="phone"
        feature={feature}
        options={{
          name: "phone",
          rules: {
            required: { value: true, message: "Phone Number is required" },
          },
          label: "Phone Number",
          width: PHONE_WIDTH,
          inputProps: { maxLength: 20 },
        }}
      />
      <CustomFormComponent
        type="input"
        feature={feature}
        options={{
          name: "extension",
          rules: { required: false },
          label: "Ext",
          width: EXT_WIDTH,
        }}
      />
    </div>
    <CustomFormComponent
      type="input"
      feature={feature}
      options={{
        name: "fax",
        rules: { required: false },
        label: "Fax",
        width: PHONE_WIDTH,
      }}
    />
  </>
);
