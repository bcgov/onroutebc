import { CountryAndProvince } from "../../../../../common/components/form/CountryAndProvince";
import { CustomFormComponent } from "../../../../../common/components/form/CustomFormComponents";
import {
  PHONE_WIDTH,
  EXT_WIDTH,
  DEFAULT_WIDTH,
  CITY_WIDTH,
} from "../../../../../themes/bcGovStyles";
import { CompanyProfile } from "../../../apiManager/manageProfileAPI";

export const CompanyPrimaryContactForm = ({
  feature,
  companyInfo,
}: {
  feature: string;
  companyInfo?: CompanyProfile;
}) => (
  <>
    <CustomFormComponent
      type="input"
      feature={feature}
      options={{
        name: "primaryContact.firstName",
        rules: { required: true },
        label: "First Name",
        inValidMessage: "First Name is required",
      }}
    />
    <CustomFormComponent
      type="input"
      feature={feature}
      options={{
        name: "primaryContact.lastName",
        rules: { required: true },
        label: "Last Name",
        inValidMessage: "Last Name is required",
      }}
    />
    <CustomFormComponent
      type="input"
      feature={feature}
      options={{
        name: "primaryContact.email",
        rules: { required: true },
        label: "Email",
        inValidMessage: "Email is required",
      }}
    />

    <div className="mp-side-by-side-container">
      <CustomFormComponent
        type="phone"
        feature={feature}
        options={{
          name: "primaryContact.phone1",
          rules: { required: true },
          label: "Phone Number",
          inValidMessage: "Phone Number is required",
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
      country={
        companyInfo?.primaryContact?.countryCode
          ? companyInfo.primaryContact.countryCode
          : ""
      }
      province={
        companyInfo?.primaryContact?.provinceCode
          ? companyInfo.primaryContact.provinceCode
          : ""
      }
      width={DEFAULT_WIDTH}
      countryField={"primaryContact.countryCode"}
      provinceField={"primaryContact.provinceCode"}
      feature={feature}
      rules={{ required: false }}
    />
    <CustomFormComponent
      type="input"
      feature={feature}
      options={{
        name: "primaryContact.city",
        rules: { required: true },
        label: "City",
        inValidMessage: "City is required",
        width: CITY_WIDTH,
      }}
    />
  </>
);
