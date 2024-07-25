import { MRT_Row } from "material-react-table";

import { CustomActionLink } from "../../../../../../common/components/links/CustomActionLink";
import { LOADetail } from "../../../../types/SpecialAuthorization";

export const LOADownloadCell = ({
  onDownload,
  props: { row },
}: {
  onDownload: (loaId: string) => void;
  props: {
    row: MRT_Row<LOADetail>;
  };
}) => {
  const loaId = `${row.original.loaId}`;
  const loaHasDocument = Boolean(row.original.documentId);

  return loaHasDocument ? (
    <CustomActionLink
      className="loa-list__link loa-list__link--download-loa"
      onClick={() => onDownload(loaId)}
    >
      Download Letter
    </CustomActionLink>
  ) : null;
};
