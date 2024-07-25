import { MRT_Row } from "material-react-table";

import { LOADetail } from "../../../../types/SpecialAuthorization";
import { CustomActionLink } from "../../../../../../common/components/links/CustomActionLink";

export const LOANumberCell = ({
  allowEditLOA,
  onEditLOA,
  props: { row },
}: {
  allowEditLOA: boolean;
  onEditLOA: (loaId: string) => void;
  props: {
    row: MRT_Row<LOADetail>;
  };
}) => {
  const loaId = `${row.original.loaId}`;
  const loaNumber = `${row.original.loaNumber}`;
  return allowEditLOA ? (
    <CustomActionLink
      className="loa-list__link loa-list__link--edit-loa"
      onClick={() => onEditLOA(loaId)}
    >
      {loaNumber}
    </CustomActionLink>
  ) : (
    <>{loaNumber}</>
  );
};
