import { CountryAndProvince } from "../../../../../common/components/form/CountryAndProvince";
import {
  CommonFormPropsType,
  CustomFormComponent,
} from "../../../../../common/components/form/CustomFormComponents";
import {
  DEFAULT_WIDTH,
  CITY_WIDTH,
  POSTAL_WIDTH,
} from "../../../../../themes/bcGovStyles";
import { CompanyProfile } from "../../../apiManager/manageProfileAPI";

export const CompanyInfoGeneralForm = ({
  commonFormProps,
  companyInfo,
}: {
  commonFormProps: CommonFormPropsType<CompanyProfile>;
  companyInfo?: CompanyProfile;
}) => (
  <>
    <CustomFormComponent
      type="input"
      commonFormProps={commonFormProps}
      options={{
        name: "companyAddress.addressLine1",
        rules: { required: true },
        label: "Address (Line 1)",
        inValidMessage: "Address is required",
      }}
    />

    <CustomFormComponent
      type="input"
      commonFormProps={commonFormProps}
      options={{
        name: "companyAddress.addressLine2",
        rules: { required: false },
        label: "Address (Line 2)",
      }}
    />

    <CountryAndProvince
      country={
        companyInfo?.companyAddress.countryCode
          ? companyInfo.companyAddress.countryCode
          : ""
      }
      province={
        companyInfo?.companyAddress.provinceCode
          ? companyInfo.companyAddress.provinceCode
          : ""
      }
      width={DEFAULT_WIDTH}
      countryField={"companyAddress.countryCode"}
      provinceField={"companyAddress.provinceCode"}
      feature="profile"
    />

    <div className="mp-side-by-side-container">
      <CustomFormComponent
        type="input"
        commonFormProps={commonFormProps}
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
        commonFormProps={commonFormProps}
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
