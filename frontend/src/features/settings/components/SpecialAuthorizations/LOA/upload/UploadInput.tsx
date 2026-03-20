import React from "react";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./UploadInput.scss";
import { CustomActionLink } from "../../../../../../common/components/links/CustomActionLink";

export const UploadInput = ({
  onChooseFile,
}: {
  onChooseFile: (file: File) => void;
}) => {
  const handleSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;
    onChooseFile(selectedFiles[0]);
  };

  return (
    <div className="upload-input">
      <div className="upload-input__icon">
        <FontAwesomeIcon className="icon" icon={faUpload} />
      </div>

      <div className="upload-input__msg">
        <span className="upload-info">
          Upload file
        </span>

        <span className="upload-info upload-info--extension">
          (PDF only)
        </span>

        <span className="upload-info">
          from computer
        </span>

        <input
          type="file"
          accept="application/pdf"
          hidden
          id="file-input"
          className="upload-input__file-input"
          onChange={handleSelectFile}
        />

        <label htmlFor="file-input">
          <CustomActionLink
            component="span"
          >
            Select file
          </CustomActionLink>
        </label>
      </div>

      <div className="upload-input__size">
        Maximum file size 10MB
      </div>
    </div>
  );
};
