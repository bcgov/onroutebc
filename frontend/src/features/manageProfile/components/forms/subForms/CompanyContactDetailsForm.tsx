import {
  CommonFormPropsType,
  CustomFormComponent,
} from "../../../../../common/components/form/CustomFormComponents";
import { PHONE_WIDTH, EXT_WIDTH } from "../../../../../themes/bcGovStyles";
import { CompanyProfile } from "../../../apiManager/manageProfileAPI";

export const CompanyContactDetailsForm = ({
  commonFormProps,
}: {
  commonFormProps: CommonFormPropsType<CompanyProfile>;
}) => (
  <>
    <CustomFormComponent
      type="input"
      commonFormProps={commonFormProps}
      options={{
        name: "email",
        rules: { required: false },
        label: "Email",
      }}
    />
    <div className="mp-side-by-side-container">
      <CustomFormComponent
        type="input"
        commonFormProps={commonFormProps}
        options={{
          name: "phone",
          rules: { required: true },
          label: "Phone Number",
          inValidMessage: "Phone Number is required",
          width: PHONE_WIDTH,
          displayAs: "phone",
          inputProps: { maxLength: 20 },
        }}
      />
      <CustomFormComponent
        type="input"
        commonFormProps={commonFormProps}
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
      commonFormProps={commonFormProps}
      options={{
        name: "fax",
        rules: { required: false },
        label: "Fax",
        width: PHONE_WIDTH,
      }}
    />
  </>
);
