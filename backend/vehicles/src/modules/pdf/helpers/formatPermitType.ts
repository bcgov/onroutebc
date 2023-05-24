import { PermitType } from "src/modules/permit/entities/permit-type.entity";
import { Repository } from "typeorm";

/**
 * Converts permitTypeCode to Permit Type Name using the ORBC_VT_PERMIT_TYPE table
 * @param permitTypeCode
 * @param permitTypeRepository
 * @returns Full name of the permit type
 */
export const formatPermitType = async (
  permitTypeCode: string,
  permitTypeRepository: Repository<PermitType>,
) => {
  const permitTypeName = await permitTypeRepository.findOne({
    where: { permitTypeId: permitTypeCode },
  });
  // TODO: Cache this ^ data
  return permitTypeName.name;
};