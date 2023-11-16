import { Typography } from "@mui/material";

import "./AmendRevisionHistory.scss";
import { AmendRevision } from "./AmendRevision";

export const AmendRevisionHistory = ({
  revisionHistory,
}: {
  revisionHistory: {
    permitId: number;
    name: string;
    revisionDateTime: string;
    comment: string;
  }[];
}) => {
  return revisionHistory.length > 0 ? (
    <div className="amend-revision-history">
      <Typography variant="h3" className="amend-revision-history__label">
        Revision History
      </Typography>
      <div className="amend-revision-history__revisions">
        {revisionHistory.map((revision) => (
          <AmendRevision key={revision.permitId} revision={revision} />
        ))}
      </div>
    </div>
  ) : null;
};
