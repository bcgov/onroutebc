import { ReadLoaDto } from 'src/modules/special-auth/dto/response/read-loa.dto';
import { PermitType } from '../enum/permit-type.enum';
import { Loas } from '../interface/permit.template.interface';
import { Permit } from 'src/modules/permit-application-payment/permit/entities/permit.entity';
import * as dayjs from 'dayjs';

export const isVehicleTypeValid = (
  permitVehicleType: string,
  permitVehicleId: string,
  powerUnits?: string[],
  trailers?: string[],
): boolean => {
  const isPowerUnitAllowed =
    permitVehicleType === 'powerUnit'
      ? powerUnits.includes(permitVehicleId)
      : true;

  const isTrailerAllowed =
    permitVehicleType === 'trailer' ? trailers.includes(permitVehicleId) : true;

  return isPowerUnitAllowed && isTrailerAllowed;
};

export const isPermitTypeValid = (
  permitTypePermit: PermitType,
  permitType: PermitType[],
): boolean => {
  return permitType.includes(permitTypePermit);
};

export const isValidDateForLoa = (
  loaDetail: Loas | ReadLoaDto,
  permit: Permit,
): boolean => {
  const { startDate, expiryDate } = loaDetail;
  const { startDate: permitStartDate, expiryDate: permitExpiryDate } =
    permit.permitData;
  return (
    dayjs(startDate).isBefore(permitStartDate, 'day') &&
    (expiryDate ? dayjs(expiryDate).isAfter(permitExpiryDate, 'day') : true)
  );
};
