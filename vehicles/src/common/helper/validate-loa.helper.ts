import { ReadLoaDto } from 'src/modules/special-auth/dto/response/read-loa.dto';
import { PermitType } from '../enum/permit-type.enum';
import { Loas, PermitData } from '../interface/permit.template.interface';
import { Permit } from 'src/modules/permit-application-payment/permit/entities/permit.entity';
import * as dayjs from 'dayjs';
import * as isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import * as isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { VehicleType } from '../enum/vehicle-type.enum';
import { ValidationResult } from 'onroute-policy-engine/.';

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

export const validateLoas = (
  application: Permit,
  loas: ReadLoaDto[],
): ValidationResult[] => {
  // Parse permit data from the application object
  const permitData = JSON.parse(
    application.permitData.permitData,
  ) as PermitData;
  const validationResults: ValidationResult[] = [];

  // Check if there are any LOAs in permit data
  if (permitData?.loas?.length) {
    const {
      vehicleType: permitVehicleType,
      vehicleSubType: permitVehicleSubtype,
    } = permitData.vehicleDetails;

    // Validate LOA details and permit data against database entries
    const loaValidationResults = validateLoaDetails(
      loas,
      application,
      permitVehicleType as VehicleType,
      permitVehicleSubtype,
    );

    // If there are any validation errors, add them to the results
    if (loaValidationResults?.length) {
      validationResults.push(...loaValidationResults);
    }

    // Validate LoA snapshot in permit Data
    const loaSnapshotValidationResults = validatePermitDataAgainstLoas(
      permitData,
      application,
      permitVehicleType as VehicleType,
      permitVehicleSubtype,
    );

    // If there are any snapshot validation errors, add them to the results
    if (loaSnapshotValidationResults?.length) {
      validationResults.push(...loaSnapshotValidationResults);
    }
  }
  return validationResults; // Return validation results
};

/**
 * Validates a list of LOA details against a permit.
 * @param readLoaDtos - List of read LOA DTOs.
 * @param permit - The permit object containing permit data.
 * @param permitVehicleType - Vehicle type from the permit.
 * @param permitVehicleSubtype - Vehicle subtype from the permit.
 * @returns An array of validation results.
 */
export const validateLoaDetails = (
  readLoaDtos: ReadLoaDto[],
  permit: Permit,
  permitVehicleType: VehicleType,
  permitVehicleSubtype: string,
): ValidationResult[] => {
  const validationResults: ValidationResult[] = [];

  // Destructure permit start and expiry dates
  const { startDate: permitStartDate, expiryDate: permitExpiryDate } =
    permit.permitData;

  for (const readLoaDto of readLoaDtos) {
    const {
      vehicleType: loaVehicleType,
      vehicleSubType: loaVehicleSubtype,
      loaPermitType: loaPermitTypes,
      startDate,
      expiryDate,
    } = readLoaDto;

    // Validate start date
    if (!isStartDateValid(startDate, permitStartDate)) {
      validationResults.push({
        type: 'violation',
        code: 'field-validation-error',
        message: `LoA ${readLoaDto.loaNumber} has invalid date(s)`,
        fieldReference: 'permitData.loas.startDate',
      });
    }

    // Validate end date
    if (!isEndDateValid(expiryDate, permitExpiryDate)) {
      validationResults.push({
        type: 'violation',
        code: 'field-validation-error',
        message: `LoA ${readLoaDto.loaNumber} has invalid date(s)`,
        fieldReference: 'permitData.loas.expiryDate',
      });
    }

    // Validate vehicle type
    if (
      !isVehicleTypeValid(
        permitVehicleType,
        permitVehicleSubtype,
        loaVehicleType,
        loaVehicleSubtype,
      )
    ) {
      validationResults.push({
        type: 'violation',
        code: 'field-validation-error',
        message: `LoA ${readLoaDto.loaNumber} has invalid vehicle(s)`,
        fieldReference: 'permitData.loas.vehicleSubType',
      });
    }

    // Validate permit type
    if (!isPermitTypeValid(permit?.permitType, loaPermitTypes)) {
      validationResults.push({
        type: 'violation',
        code: 'field-validation-error',
        message: `LoA ${readLoaDto.loaNumber} has invalid permitType`,
        fieldReference: 'permitData.loas.vehicleSubType',
      });
    }
  }
  return validationResults; // Return validation results
};

/**
 * Validates permit data against the list of LOAs.
 * @param permitData - The permit data object.
 * @param permit - The permit entity containing relevant data.
 * @param permitVehicleType - Vehicle type information from the permit.
 * @param permitVehicleSubtype - Vehicle subtype information from the permit.
 * @returns An array of validation results.
 */
export const validatePermitDataAgainstLoas = (
  permitData: PermitData,
  permit: Permit,
  permitVehicleType: VehicleType,
  permitVehicleSubtype: string,
): ValidationResult[] => {
  const validationResults: ValidationResult[] = [];

  // Destructure permit start and expiry dates
  const { startDate: permitStartDate, expiryDate: permitExpiryDate } =
    permit.permitData;

  // Iterate over each LOA in permit data for validation
  for (const loa of permitData.loas) {
    const {
      vehicleType: loaVehicleType,
      vehicleSubType: loaVehicleSubtype,
      loaPermitType: loaPermitTypes,
      startDate,
      expiryDate,
    } = loa;

    // Validate start date
    if (!isStartDateValid(startDate, permitStartDate)) {
      validationResults.push({
        type: 'violation',
        code: 'field-validation-error',
        message: `LoA ${loa?.loaNumber} snaphot has invalid date(s)`,
        fieldReference: 'permitData.loas.startDate',
      });
    }

    // Validate end date
    if (!isEndDateValid(expiryDate, permitExpiryDate)) {
      validationResults.push({
        type: 'violation',
        code: 'field-validation-error',
        message: `LoA ${loa?.loaNumber} snaphot has invalid date(s)`,
        fieldReference: 'permitData.loas.expiryDate',
      });
    }

    // Validate vehicle type
    if (
      !isVehicleTypeValid(
        permitVehicleType,
        permitVehicleSubtype,
        loaVehicleType,
        loaVehicleSubtype,
      )
    ) {
      validationResults.push({
        type: 'violation',
        code: 'field-validation-error',
        message: `LoA ${loa?.loaNumber} snapshot has invalid vehicle(s)`,
        fieldReference: 'permitData.loas.vehicleSubType',
      });
    }

    // Validate permit type
    if (!isPermitTypeValid(permit.permitType, loaPermitTypes)) {
      validationResults.push({
        type: 'violation',
        code: 'field-validation-error',
        message: `LoA ${loa?.loaNumber} snapshot has invalid permitType`,
        fieldReference: 'permitData.loas.vehicleSubType',
      });
    }
  }
  return validationResults; // Return validation results
};
