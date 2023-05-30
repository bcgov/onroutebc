import { getDefaultRequiredVal } from "../../../common/helpers/util";
import {
  TermOversizeApplication,
  Commodities,
  VehicleDetails as VehicleDetailsType,
  ContactDetails as ContactDetailsType,
} from "../types/application";
import { dayjsToLocalStr } from "../../../common/helpers/formatDate";

const areContactDetailsEqual = (contactDetails1?: ContactDetailsType, contactDetails2?: ContactDetailsType) => {
  if (!contactDetails1 && !contactDetails2) return true;
  if (!contactDetails1 || !contactDetails2) return false;
  return Object.entries(contactDetails1)
    .map(([key, val]) => {
      const val2 = contactDetails2[key as keyof ContactDetailsType];
      return getDefaultRequiredVal("", val) === getDefaultRequiredVal("", val2);
    })
    .reduce((prevIsEqual, currIsEqual) => prevIsEqual && currIsEqual, true);
};

const areCommoditiesEqual = (list1: Commodities[], list2: Commodities[]) => {
  const commodityMap1 = new Map(list1.map(commodity1 => [commodity1.description, commodity1]));
  const commodityMap2 = new Map(list2.map(commodity2 => [commodity2.description, commodity2]));
  for (const [description, commodity] of commodityMap1) {
    if (commodity.checked !== commodityMap2.get(description)?.checked) {
      return false;
    }
  }

  for (const [description, commodity] of commodityMap2) {
    if (commodity.checked !== commodityMap1.get(description)?.checked) {
      return false;
    }
  }

  return true;
};

const areVehicleDetailsEqual = (vehicleDetails1?: VehicleDetailsType, vehicleDetails2?: VehicleDetailsType) => {
  if (!vehicleDetails1 && !vehicleDetails2) return true;
  if (!vehicleDetails1 || !vehicleDetails2) return false;
  return Object.entries(vehicleDetails1)
    .map(([key, val]) => {
      const val2 = vehicleDetails2[key as keyof VehicleDetailsType];
      return getDefaultRequiredVal("", val) === getDefaultRequiredVal("", val2);
    })
    .reduce((prevIsEqual, currIsEqual) => prevIsEqual && currIsEqual, true);
};

export const areApplicationDataEqual = (data1: TermOversizeApplication, data2: TermOversizeApplication) => {
  return data1.permitDuration === data2.permitDuration
    && dayjsToLocalStr(data1.startDate) === dayjsToLocalStr(data2.startDate)
    && dayjsToLocalStr(data1.expiryDate) === dayjsToLocalStr(data2.expiryDate)
    && areContactDetailsEqual(data1.contactDetails, data2.contactDetails)
    && areVehicleDetailsEqual(data1.vehicleDetails, data2.vehicleDetails)
    && areCommoditiesEqual(data1.commodities, data2.commodities);
};
