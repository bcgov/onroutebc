import { ReadLoaDto } from 'src/modules/special-auth/dto/response/read-loa.dto';
import { PermitType } from '../enum/permit-type.enum';
import { Loas, PermitData } from '../interface/permit.template.interface';
import { Permit } from 'src/modules/permit-application-payment/permit/entities/permit.entity';
import * as dayjs from 'dayjs';
import * as isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import * as isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

import { In, QueryRunner } from 'typeorm';
import { LoaDetail } from 'src/modules/special-auth/entities/loa-detail.entity';
import { Mapper } from '@automapper/core';
import { UnprocessableEntityException } from '@nestjs/common';
import { VehicleType } from '../enum/vehicle-type.enum';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
export const isVehicleTypeValid = (
  permitVehicleType: VehicleType,
  permitVehicleSubtype: string,
  loaVehicleType: VehicleType,
  loaVehicleSubtype: string,
): boolean => {
  return (
    permitVehicleType === loaVehicleType &&
    permitVehicleSubtype === loaVehicleSubtype
  );
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
    isStartDateValid(startDate, permitStartDate) &&
    isEndDateValid(expiryDate, permitExpiryDate)
  );
};

export const isStartDateValid = (
  startDate: string,
  permitStartDate: string,
): boolean => {
  return dayjs(startDate).isSameOrBefore(permitStartDate, 'day');
};

export const isEndDateValid = (
  expiryDate: string,
  permitExpiryDate: string,
): boolean => {
  return expiryDate
    ? dayjs(expiryDate).isSameOrAfter(permitExpiryDate, 'day')
    : true;
};
export const isValidLoa = async (
  permit: Permit,
  queryRunner: QueryRunner,
  mapper: Mapper,
) => {
  const permitData = JSON.parse(permit.permitData.permitData) as PermitData;
  if (permitData.loas) {
    const {
      vehicleType: permitVehicleType,
      vehicleSubType: permitVehicleSubtype,
    } = permitData.vehicleDetails;
    const { companyId } = permit.company;
    const loaNumbers = permitData.loas.map((loa) => loa.loaNumber);
    const readLoaDto = await findLoas(
      companyId,
      loaNumbers,
      queryRunner,
      mapper,
    );

    const permitVehicleTypeEnum = VehicleType[permitVehicleType] as VehicleType;
    // Validate LOA details and permit data against database entries
    validateLoaDetails(
      readLoaDto,
      permit,
      permitVehicleTypeEnum,
      permitVehicleSubtype,
    );

    // validate LoA snapshot in permit Data
    validatePermitDataAgainstLoas(
      permitData,
      permit,
      permitVehicleTypeEnum,
      permitVehicleSubtype,
    );
  }
};
export const validateLoaDetails = (
  readLoaDtos: ReadLoaDto[],
  permit: Permit,
  permitVehicleType: VehicleType,
  permitVehicleSubtype: string,
) => {
  for (const readLoaDto of readLoaDtos) {
    const {
      vehicleType: loaVehicleType,
      vehicleSubType: loaVehicleSubtype,
      loaPermitType: loaPermitTypes,
    } = readLoaDto;
    if (!isValidDateForLoa(readLoaDto, permit)) {
      throw new UnprocessableEntityException(
        `${permit.applicationNumber} has LoA ${readLoaDto.loaNumber} with invalid date(s).`,
      );
    }
    if (
      !isVehicleTypeValid(
        permitVehicleType,
        permitVehicleSubtype,
        loaVehicleType,
        loaVehicleSubtype,
      )
    ) {
      throw new UnprocessableEntityException(
        `${permit.applicationNumber} has LoA ${readLoaDto.loaNumber} with invalid vehicle(s).`,
      );
    }
    if (!isPermitTypeValid(permit.permitType, loaPermitTypes)) {
      throw new UnprocessableEntityException(
        `${permit.applicationNumber} has LoA ${readLoaDto.loaNumber} with invalid permitType.`,
      );
    }
  }
};

export const validatePermitDataAgainstLoas = (
  permitData: PermitData,
  permit: Permit,
  permitVehicleType: VehicleType,
  permitVehicleSubtype: string,
) => {
  for (const loa of permitData.loas) {
    const permitLoaVehicleType = loa.vehicleType;
    const permitLoaVehicleSubtype = loa.vehicleSubType;
    const permitTypesLoa = loa.loaPermitType;
    if (!isValidDateForLoa(loa, permit)) {
      throw new UnprocessableEntityException(
        `${permit.applicationNumber} has LoA ${loa.loaNumber} snapshot with invalid date(s).`,
      );
    }

    if (
      !isVehicleTypeValid(
        permitVehicleType,
        permitVehicleSubtype,
        permitLoaVehicleType,
        permitLoaVehicleSubtype,
      )
    ) {
      throw new UnprocessableEntityException(
        `${permit.applicationNumber} has LoA ${loa.loaNumber}  snapshot with invalid vehicle(s).`,
      );
    }
    if (!isPermitTypeValid(permit.permitType, permitTypesLoa)) {
      throw new UnprocessableEntityException(
        `${permit.applicationNumber} has LoA ${loa.loaNumber} snapshot with invalid permitType.`,
      );
    }
  }
};

/**
 * Retrieves a single LOA (Letter of Authorization) detail for a specified company.
 *
 * Steps:
 * 1. Fetches the LOA detail from the repository based on company ID and LOA Number.
 * 2. Ensures the fetched LOA detail is active.
 * 3. Includes relations (company, loaVehicles, loaPermitTypes) in the query.
 *
 * @param {number} companyId - ID of the company for which to fetch the LOA detail.
 * @param {number} loaNumber - Number of the LOA to be fetched.
 * @returns {Promise<LoaDetail>} - Returns a Promise that resolves to the LOA detail.
 */
export const findLoas = async (
  companyId: number,
  loaNumbers: number[],
  queryRunner: QueryRunner,
  mapper: Mapper,
): Promise<ReadLoaDto[]> => {
  // Fetch initial active LOA details
  const loaDetails = await queryRunner.manager.find(LoaDetail, {
    where: {
      loaNumber: In(loaNumbers),
      isActive: true,
      company: { companyId },
    },
    relations: ['company', 'loaVehicles', 'loaPermitTypes'],
  });
  const readLoaDto = await mapper.mapArrayAsync(
    loaDetails,
    LoaDetail,
    ReadLoaDto,
    {
      extraArgs: () => ({ companyId: companyId }),
    },
  );
  return readLoaDto;
};
