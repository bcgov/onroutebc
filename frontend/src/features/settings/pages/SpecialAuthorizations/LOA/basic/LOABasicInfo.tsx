import { useState } from "react";
import { Dayjs } from "dayjs";
import { Checkbox } from "@mui/material";
import {
  useFormContext,
  FieldPathValue,
  Controller,
  FieldValues,
} from "react-hook-form";

import "./LOABasicInfo.scss";
import { LOAFormData } from "../../../../types/LOAFormData";
import { PERMIT_TYPES } from "../../../../../permits/types/PermitType";
import { CustomFormComponent } from "../../../../../../common/components/form/CustomFormComponents";
import { Nullable, Optional } from "../../../../../../common/types/common";
import { UploadedFile } from "../../../../components/SpecialAuthorizations/LOA/upload/UploadedFile";
import { UploadInput } from "../../../../components/SpecialAuthorizations/LOA/upload/UploadInput";
import { applyWhenNotNullable } from "../../../../../../common/helpers/util";
import { DeleteConfirmationDialog } from "../../../../../../common/components/dialog/DeleteConfirmationDialog";
import {
  CustomDatePicker,
  PAST_START_DATE_STATUSES,
} from "../../../../../../common/components/form/subFormComponents/CustomDatePicker";

import {
  expiryMustBeAfterStart,
  invalidUploadFormat,
  requiredMessage,
  requiredUpload,
  selectionRequired,
  uploadSizeExceeded,
} from "../../../../../../common/helpers/validationMessages";

const FEATURE = "loa";

const permitTypeRules =  {
  validate: {
    requiredPermitTypes: (
      value: Optional<{
        STOS: boolean;
        TROS: boolean;
        STOW: boolean;
        TROW: boolean;
        STOL: boolean;
        STWS: boolean;
      }>,
    ) => {
      return (
        value?.STOS ||
        value?.TROS ||
        value?.STOW ||
        value?.TROW ||
        value?.STOL ||
        value?.STWS ||
        selectionRequired()
      );
    },
  },
};

const expiryRules = {
  validate: {
    requiredIfLOAExpires: (value: Nullable<Dayjs>, formValues: FieldValues) => {
      return (!value && formValues.neverExpires)
        || (Boolean(value) && !formValues.neverExpires)
        || requiredMessage();
    },
    mustBeAfterStartDate: (value: Nullable<Dayjs>, formValues: FieldValues) => {
      return !value
        || (value.isAfter(formValues.startDate))
        || expiryMustBeAfterStart();
    },
  },
};

const uploadRules = {
  validate: {
    requiredLOAUpload: (
      value: Nullable<{
        fileName: string;
      }> | File,
    ) => {
      return Boolean(value) || requiredUpload("LOA");
    },
    lessThanSizeLimit: (
      value: Nullable<{
        fileName: string;
      }> | File,
    ) => {
      const fileSizeLimit = 10 * 1024 * 1024;
      return !value
        || !(value instanceof File)
        || value.size < fileSizeLimit
        || uploadSizeExceeded();
    },
    mustBePdf: (
      value: Nullable<{
        fileName: string;
      }> | File,
    ) => {
      const fileFormat = "application/pdf";
      return !value
        || !(value instanceof File)
        || value.type === fileFormat
        || invalidUploadFormat();
    },
  }
};

export const LOABasicInfo = ({
  onRemoveDocument,
}: {
  onRemoveDocument: () => Promise<boolean>;
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);

  const {
    control,
    formState: { errors },
    watch,
    setValue,
    clearErrors,
    trigger,
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

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
  };

  const selectPermitType = (
    permitType: keyof FieldPathValue<LOAFormData, "permitTypes">,
    selected: boolean,
  ) => {
    setValue(`permitTypes.${permitType}`, selected);
    if (Object.values(permitTypes).filter(selected => selected).length > 0) {
      clearErrors("permitTypes");
    }
    trigger("permitTypes");
  };

  const toggleLOANeverExpires = (shouldNeverExpire: boolean) => {
    setValue("neverExpires", shouldNeverExpire);
    if (shouldNeverExpire) {
      setValue("expiryDate", null);
    }
    trigger("expiryDate");
  };

  const handleStartDateChange = (startDate: Dayjs | null) => {
    if (startDate) {
      setValue("startDate", startDate);
      trigger("startDate");
      trigger("expiryDate");
    }
  };

  const handleExpiryDateChange = (expiryDate: Dayjs | null) => {
    setValue("expiryDate", expiryDate);
    trigger("startDate");
    trigger("expiryDate");
  };

  const selectFile = (file: File) => {
    setValue("uploadFile", file);
    trigger("uploadFile");
  };

  const deleteFile = async () => {
    if (await onRemoveDocument()) {
      setValue("uploadFile", null);
      clearErrors("uploadFile");
    }
    setShowDeleteDialog(false);
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
            {errors.permitTypes.message}
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
            <CustomDatePicker
              className="loa-date-inputs__start"
              feature={FEATURE}
              name="startDate"
              rules={{
                required: { value: true, message: requiredMessage() },
              }}
              label="Start Date"
              pastStartDateStatus={PAST_START_DATE_STATUSES.ALLOWED}
              onChangeOverride={handleStartDateChange}
            />

            <CustomDatePicker
              className="loa-date-inputs__expiry"
              feature={FEATURE}
              name="expiryDate"
              rules={expiryRules}
              label="Expiry Date"
              disabled={neverExpires}
              readOnly={neverExpires}
              pastStartDateStatus={PAST_START_DATE_STATUSES.ALLOWED}
              onChangeOverride={handleExpiryDateChange}
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

      <Controller
        name="uploadFile"
        control={control}
        rules={uploadRules}
        render={({
          fieldState: { error },
        }) => (
          <div 
            className="loa-basic-info__section loa-basic-info__section--upload"
          >
            <div className="loa-basic-info__header">
              Upload LOA
            </div>

            {fileExists ? (
              <UploadedFile
                fileName={fileName}
                onDelete={() => setShowDeleteDialog(true)}
              />
            ) : (
              <UploadInput
                onChooseFile={selectFile}
              />
            )}

            {error?.message ? (
              <div className="loa-basic-info__error">
                {error.message}
              </div>
            ) : null}
          </div>
        )}
      />

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

      {showDeleteDialog ? (
        <DeleteConfirmationDialog
          showDialog={showDeleteDialog}
          onCancel={handleCancelDelete}
          onDelete={deleteFile}
          itemToDelete="item"
          confirmationMsg={"Are you sure you want to delete this?"}
        />
      ) : null}
    </div>
  );
};
