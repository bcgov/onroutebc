import {
  RegisterOptions,
  useFormContext,
  FieldPathValue,
  Controller,
  FieldValues,
} from "react-hook-form";

import "./LOABasicInfo.scss";
import { LOAFormData } from "../../../../types/LOAFormData";
import { PERMIT_TYPES } from "../../../../../permits/types/PermitType";
import { Checkbox } from "@mui/material";
import { CustomFormComponent } from "../../../../../../common/components/form/CustomFormComponents";
import { requiredMessage } from "../../../../../../common/helpers/validationMessages";
import { Nullable } from "../../../../../../common/types/common";
import { Dayjs } from "dayjs";
import { UploadedFile } from "../../../../components/SpecialAuthorizations/LOA/upload/UploadedFile";
import { UploadInput } from "../../../../components/SpecialAuthorizations/LOA/upload/UploadInput";
import { applyWhenNotNullable } from "../../../../../../common/helpers/util";

const FEATURE = "loa";

const expiryRules = {
  validate: {
    requiredIfLOAExpires: (value: Nullable<Dayjs>, formValues: FieldValues) => {
      return (!value && formValues.neverExpires)
        || requiredMessage();
    },
  },
};

export const LOABasicInfo = ({
  permitTypeRules,
}: {
  permitTypeRules: RegisterOptions;
}) => {
  const {
    control,
    formState: { errors },
    watch,
    setValue,
    clearErrors,
  } = useFormContext<LOAFormData>();

  const permitTypes = watch("permitTypes");
  const neverExpires = watch("neverExpires");
  const uploadFile = watch("uploadFile");

  const fileExists = Boolean(uploadFile);
  const fileName = applyWhenNotNullable(
    file => (file instanceof File) ? file.name : file?.fileName,
    uploadFile,
    "",
  );

  const fileSize = applyWhenNotNullable(
    file => (file instanceof File) ? file.size : file?.fileSize,
    uploadFile,
    0,
  );

  /*
  const fileMimeType = applyWhenNotNullable(
    file => (file instanceof File) ? file.type : file?.fileMimeType,
    uploadFile,
    "",
  );
  */

  const selectPermitType = (
    permitType: keyof FieldPathValue<LOAFormData, "permitTypes">,
    selected: boolean,
  ) => {
    setValue(`permitTypes.${permitType}`, selected);
    if (Object.values(permitTypes).filter(selected => selected).length > 0) {
      clearErrors("permitTypes");
    }
  };

  const toggleLOANeverExpires = (shouldNeverExpire: boolean) => {
    setValue("neverExpires", shouldNeverExpire);
    if (shouldNeverExpire) {
      setValue("expiryDate", null);
    }
  };

  const selectFile = (file: File) => {
    setValue("uploadFile", file);
  };

  const deleteFile = () => {
    setValue("uploadFile", null);
  };

  return (
    <div className="loa-basic-info">
      <div 
        className="loa-basic-info__section loa-basic-info__section--permit-types"
      >
        <div className="loa-basic-info__header">
          Select Permit Type(s)
        </div>

        {errors.permitTypes ? (
          <div className="loa-basic-info__error">
            Select at least one item
          </div>
        ) : null}

        <Controller
          name="permitTypes"
          control={control}
          rules={permitTypeRules}
          render={({
            fieldState: { invalid },
          }) => (
            <div className="permit-type-selection">
              <div className="permit-type-selection__category-header">
                Oversize
              </div>

              <div className="permit-type-selection__option">
                <Checkbox
                  className={`permit-type-selection__checkbox ${invalid ? "permit-type-selection__checkbox--invalid" : ""}`}
                  checked={permitTypes.STOS}
                  onChange={(_, selected) => selectPermitType(PERMIT_TYPES.STOS, selected)}
                />
                <div className="permit-type-selection__label">{PERMIT_TYPES.STOS}</div>
              </div>

              <div className="permit-type-selection__option">
                <Checkbox
                  className={`permit-type-selection__checkbox ${invalid ? "permit-type-selection__checkbox--invalid" : ""}`}
                  checked={permitTypes.TROS}
                  onChange={(_, selected) => selectPermitType(PERMIT_TYPES.TROS, selected)}
                />
                <div className="permit-type-selection__label">{PERMIT_TYPES.TROS}</div>
              </div>

              <div className="permit-type-selection__category-header">
                Overweight
              </div>

              <div className="permit-type-selection__option">
                <Checkbox
                  className={`permit-type-selection__checkbox ${invalid ? "permit-type-selection__checkbox--invalid" : ""}`}
                  checked={permitTypes.STOW}
                  onChange={(_, selected) => selectPermitType(PERMIT_TYPES.STOW, selected)}
                />
                <div className="permit-type-selection__label">{PERMIT_TYPES.STOW}</div>
              </div>

              <div className="permit-type-selection__option">
                <Checkbox
                  className={`permit-type-selection__checkbox ${invalid ? "permit-type-selection__checkbox--invalid" : ""}`}
                  checked={permitTypes.TROW}
                  onChange={(_, selected) => selectPermitType(PERMIT_TYPES.TROW, selected)}
                />
                <div className="permit-type-selection__label">{PERMIT_TYPES.TROW}</div>
              </div>

              <div className="permit-type-selection__category-header">
                Overweight Oversized
              </div>

              <div className="permit-type-selection__option">
                <Checkbox
                  className={`permit-type-selection__checkbox ${invalid ? "permit-type-selection__checkbox--invalid" : ""}`}
                  checked={permitTypes.STOL}
                  onChange={(_, selected) => selectPermitType(PERMIT_TYPES.STOL, selected)}
                />
                <div className="permit-type-selection__label">
                  {`${PERMIT_TYPES.STOL} (Length 27.5 - Empty)`}
                </div>
              </div>
              
              <div className="permit-type-selection__option">
                <Checkbox
                  className={`permit-type-selection__checkbox ${invalid ? "permit-type-selection__checkbox--invalid" : ""}`}
                  checked={permitTypes.STWS}
                  onChange={(_, selected) => selectPermitType(PERMIT_TYPES.STWS, selected)}
                />
                <div className="permit-type-selection__label">{PERMIT_TYPES.STWS}</div>
              </div>
            </div>
          )}
        />
      </div>

      <div 
        className="loa-basic-info__section loa-basic-info__section--dates"
      >
        <div className="loa-basic-info__header">
          Choose a Start Date and Expiry Date
        </div>

        <div className="loa-basic-info__date-selection">
          <div className="loa-date-inputs">
            <CustomFormComponent
              className="loa-date-inputs__start"
              type="datePicker"
              feature={FEATURE}
              options={{
                name: "startDate",
                rules: {
                  required: { value: true, message: requiredMessage() },
                },
                label: "Start Date",
              }}
            />

            <CustomFormComponent
              className="loa-date-inputs__expiry"
              type="datePicker"
              feature={FEATURE}
              options={{
                name: "expiryDate",
                rules: expiryRules,
                label: "Expiry Date",
              }}
              disabled={neverExpires}
              readOnly={neverExpires}
            />
          </div>
          
          <div className="loa-never-expires">
            <Checkbox
              className={`loa-never-expires__checkbox`}
              checked={neverExpires}
              onChange={(_, selected) => toggleLOANeverExpires(selected)}
            />
            <div className="loa-never-expires__label">LOA never expires</div>
          </div>
        </div>
      </div>

      <div 
        className="loa-basic-info__section loa-basic-info__section--upload"
      >
        <div className="loa-basic-info__header">
          Upload LOA
        </div>

        {fileExists ? (
          <UploadedFile
            fileName={fileName}
            fileSize={fileSize}
            onDelete={deleteFile}
          />
        ) : (
          <UploadInput
            onChooseFile={selectFile}
          />
        )}
      </div>

      <div 
        className="loa-basic-info__section loa-basic-info__section--notes"
      >
        <div className="loa-basic-info__header">
          Additional Notes
        </div>

        <CustomFormComponent
          type="textarea"
          feature={FEATURE}
          options={{
            label: "Notes",
            name: "additionalNotes",
            rules: { required: false },
          }}
          className="loa-basic-info__notes"
        />
      </div>
    </div>
  );
};
