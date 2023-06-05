import { Permit } from 'src/modules/permit/entities/permit.entity';
import {
  PermitData,
  PermitTemplate,
} from '../interface/permit.template.interface';
import { FullNames } from '../interface/fullNames.interface';
import { ReadCompanyDto } from 'src/modules/company-user-management/company/dto/response/read-company.dto';

/**
 * Formats the permit data so that it can be used in the templated word documents
 * @param permit
 * @param fullNames
 * @returns formatted permit data to be displayed on the PDF
 */
export const formatTemplateData = (
  permit: Permit,
  fullNames: FullNames,
  companyInfo: ReadCompanyDto,
) => {
  // Create a new template object that includes the formatted values used in the templated word documents
  const template: PermitTemplate = {
    permitName: '',
    permitNumber: '',
    createdDateTime: '',
    updatedDateTime: '',
    companyName: '',
    clientNumber: '',
    revisions: [
      {
        timeStamp: '',
        description: 'N/A',
      },
    ],
    permitData: null,
  };

  template.permitData = JSON.parse(permit.permitData.permitData) as PermitData;

  // Format Permit information
  template.permitName = fullNames.permitName;
  template.permitNumber = permit.permitNumber || ''; // TODO
  template.createdDateTime = permit.createdDateTime.toISOString(); // TODO: timezone? Format is done in word template
  template.updatedDateTime = permit.updatedDateTime.toISOString(); // TODO: timezone? Format is done in word template

  // Format Vehicle Details
  template.permitData.vehicleDetails.vehicleType = fullNames.vehicleTypeName;
  template.permitData.vehicleDetails.vehicleSubType =
    fullNames.vehicleSubTypeName;
  template.permitData.vehicleDetails.countryCode = fullNames.mailingCountryName;
  template.permitData.vehicleDetails.provinceCode =
    fullNames.mailingProvinceName;

  // Format Mailing Address
  template.permitData.mailingAddress.countryCode = fullNames.vehicleCountryName;
  template.permitData.mailingAddress.provinceCode =
    fullNames.vehicleProvinceName;

  // Format Company
  template.companyName = companyInfo.legalName;
  template.clientNumber = companyInfo.clientNumber;

  // Format Fee Summary
  template.permitData.feeSummary =
    template.permitData.permitDuration.toString(); // TODO: get from frontend

  return template;
};
