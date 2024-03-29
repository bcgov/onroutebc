import "./AmendRevision.scss";
import {
  DATE_FORMATS,
  toLocal,
} from "../../../../../../common/helpers/formatDate";

export const AmendRevision = ({
  revision,
}: {
  revision: {
    permitId: number;
    name: string;
    revisionDateTime: string;
    comment: string;
  };
}) => {
  return (
    <div className="amend-revision">
      <div className="amend-revision__info">
        <span
          className="amend-revision__name"
          data-testid={`amend-revision-permit-${revision.permitId}-by`}
        >
          {revision.name}
        </span>
        ,{" "}
        <span
          className="amend-revision__date"
          data-testid={`amend-revision-permit-${revision.permitId}-at`}
        >
          {toLocal(revision.revisionDateTime, DATE_FORMATS.LONG)}
        </span>
      </div>
      <div className="amend-revision__comment">{revision.comment}</div>
    </div>
  );
};
