import { Permit } from 'src/modules/permit/entities/permit.entity';
import { FullNames } from '../../cache/interface/fullNames.interface';

/**
 * Formats the permit data so that it can be used in the templated word documents
 * @param permit
 * @param fullNames
 * @returns formatted permit data to be displayed on the PDF
 */
export const formatTemplateData = async (
  permit: Permit,
  fullNames: FullNames,
) => {
  // Create a new template object that is a copy of the permit
  // This template object will include the formatted values used in the templated word documents
  const template: any = permit;
  template.permitData = JSON.parse(permit.permitData.permitData);

  // TODO: Revision history
  const revisions = [
    {
      timeStamp: '',
      description: 'N/A',
    },
  ];

  // Format Permit information
  template.permitName = fullNames.permitName;
  template.revisions = revisions;

  // Format Vehicle Details
  template.permitData.vehicleDetails.vehicleType = fullNames.vehicleType;
  template.permitData.vehicleDetails.vehicleSubType = fullNames.vehicleSubType;
  template.permitData.vehicleDetails.countryCode = fullNames.mailingCountryCode;
  template.permitData.vehicleDetails.provinceCode =
    fullNames.mailingProvinceCode;

  // Format Mailing Address
  template.permitData.mailingAddress.countryCode = fullNames.vehicleCountryCode;
  template.permitData.mailingAddress.provinceCode =
    fullNames.vehicleProvinceCode;

  //templateData.createdDateTime = permit.createdDateTime.toLocaleString(); // TODO: timezone? Format is done in word template
  //templateData.updatedDateTime = permit.updatedDateTime.toLocaleString(); // TODO: timezone? Format is done in word template

  return template;
};
