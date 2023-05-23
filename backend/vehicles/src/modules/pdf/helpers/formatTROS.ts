import { Permit } from 'src/modules/permit/entities/permit.entity';
import { PermitData } from '../interface/permitData.interface';
import { formatCountry, formatProvince } from './formatCountryProvince';
import { PowerUnitTypesService } from 'src/modules/vehicles/power-unit-types/power-unit-types.service';
import { TrailerTypesService } from 'src/modules/vehicles/trailer-types/trailer-types.service';
import { formatVehicleTypes } from './formatVehicleTypes';
import { Country } from 'src/modules/common/entities/country.entity';
import { Repository } from 'typeorm';
import { Province } from 'src/modules/common/entities/province.entity';

/**
 * TODO: Should formatting be done on the frontend?
 * @param permit
 * @param powerUnitTypeService
 * @param trailerTypeService
 * @returns formatted Term Oversize data to be displayed on the PDF
 */
export const formatTROS = async (
  permit: Permit,
  powerUnitTypeService: PowerUnitTypesService, //TODO: fix prop drilling?
  trailerTypeService: TrailerTypesService, //TODO: fix prop drilling?
  countryRepository: Repository<Country>,
  provinceRepository: Repository<Province>,
) => {
  // Parse permitData string into JSON
  const templateData: any = permit;

  const permitData: PermitData = JSON.parse(permit.permitData.permitData); // TODO: Type?
  templateData.permitData = permitData;

  const vehicleType = await formatVehicleTypes(
    permitData,
    powerUnitTypeService,
    trailerTypeService,
  );

  const mailingCountryCode = await formatCountry(
    permitData.vehicleDetails.countryCode,
    countryRepository,
  );
  const mailingProvinceCode = await formatProvince(
    permitData.vehicleDetails.provinceCode,
    provinceRepository,
  );
  const vehicleCountryCode = await formatCountry(
    permitData.mailingAddress.countryCode,
    countryRepository,
  );
  const vehicleProvinceCode = await formatProvince(
    permitData.mailingAddress.provinceCode,
    provinceRepository,
  );

  templateData.permitData.vehicleDetails.vehicleType = vehicleType.vehicleType;
  templateData.permitData.vehicleDetails.vehicleSubType =
    vehicleType.vehicleSubType;
  templateData.permitData.vehicleDetails.countryCode = mailingCountryCode;
  templateData.permitData.vehicleDetails.provinceCode = mailingProvinceCode;
  templateData.permitData.mailingAddress.countryCode = vehicleCountryCode;
  templateData.permitData.mailingAddress.provinceCode = vehicleProvinceCode;
  templateData.createdDateTime = permit.createdDateTime.toLocaleString(); // TODO: timezone?
  templateData.updatedDateTime = permit.updatedDateTime.toLocaleString(); // TODO: timezone?

  return templateData;
};
