import { useState } from "react";
import { faFile, faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { faTrashCan as faTrashHover } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton } from "@mui/material";

import "./UploadedFile.scss";

export const UploadedFile = ({
  fileName,
  fileSize,
  onDelete,
}: {
  fileName: string;
  fileSize: number;
  onDelete: () => void;
}) => {
  const [deleteOnHover, setDeleteOnHover] = useState<boolean>(false);

  const displayedFileSize = () => {
    const KB = 1024;
    const sizeInKb = fileSize / KB;
    if (sizeInKb < KB) {
      return `${sizeInKb.toFixed(2)} KB`;
    }

    const sizeInMb = sizeInKb / KB;
    return `${sizeInMb.toFixed(2)} MB`;
  };

  return (
    <div className="uploaded-file">
      <div className="uploaded-file__icon">
        <FontAwesomeIcon className="icon" icon={faFile} />
      </div>

      <div className="uploaded-file__info">
        <div className="uploaded-file__name">
          {fileName}
        </div>

        <div className="uploaded-file__size">
          {displayedFileSize()}
        </div>
      </div>

      <IconButton
        classes={{
          root: "uploaded-file__delete-btn",
        }}
        onClick={onDelete}
        onMouseEnter={() => setDeleteOnHover(true)}
        onMouseLeave={() => setDeleteOnHover(false)}
        disabled={false}
      >
        {deleteOnHover ? (
          <FontAwesomeIcon
            className="delete-icon delete-icon--hover"
            icon={faTrashHover}
          />
        ) : (
          <FontAwesomeIcon
            className="delete-icon delete-icon--delete"
            icon={faTrashCan}
          />
        )}

        {deleteOnHover ? (
          <div className="tooltip">
            Delete
          </div>
        ) : null}
      </IconButton>
    </div>
  );
};
