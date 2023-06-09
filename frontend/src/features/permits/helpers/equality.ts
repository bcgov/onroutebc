import { getDefaultRequiredVal } from "../../../common/helpers/util";
import {
  TermOversizeApplication,
  Commodities,
  VehicleDetails as VehicleDetailsType,
  ContactDetails as ContactDetailsType,
} from "../types/application";
import { DATE_FORMATS, dayjsToLocalStr } from "../../../common/helpers/formatDate";

/**
 * Compare whether or not two contact details are equal.
 * @param contactDetails1 first contact details info
 * @param contactDetails2 second contact details info
 * @returns true when contact details are equivalent, false otherwise
 */
const areContactDetailsEqual = (contactDetails1?: ContactDetailsType, contactDetails2?: ContactDetailsType) => {
  if (!contactDetails1 && !contactDetails2) return true; // considered equal when both are undefined
  if (!contactDetails1 || !contactDetails2) return false; // considered not equal when only one is undefined

  // Equal when all key-value pairs of both contacts details are equal
  return Object.entries(contactDetails1)
    .map(([key, val]) => {
      const val2 = contactDetails2[key as keyof ContactDetailsType]; // get value from second contact details for this key
      return getDefaultRequiredVal("", val) === getDefaultRequiredVal("", val2);
    })
    .reduce((prevIsEqual, currIsEqual) => prevIsEqual && currIsEqual, true);
};

/**
 * Compare whether or not two commodities lists are equal.
 * @param list1 first commodities list
 * @param list2 second commodities list
 * @returns true when commodities lists are equivalent, false otherwise
 */
export const areCommoditiesEqual = (list1: Commodities[], list2: Commodities[]) => {
  // Instead of comparing arrays directly (as items can be in different orders), transform them into maps and compare key-value pairs
  const commodityMap1 = new Map(list1.map(commodity1 => [commodity1.condition, commodity1]));
  const commodityMap2 = new Map(list2.map(commodity2 => [commodity2.condition, commodity2]));

  // Compare all key-value pairs of first commodities map with key-value pairs of second commodities map
  for (const [condition, commodity] of commodityMap1) {
    if (commodity.checked !== commodityMap2.get(condition)?.checked) {
      return false;
    }
  }

  // Do the same the other way (ie. kv pairs of second map with kv pairs of first)
  for (const [condition, commodity] of commodityMap2) {
    if (commodity.checked !== commodityMap1.get(condition)?.checked) {
      return false;
    }
  }

  return true;
};

/**
 * Compare whether or not two vehicle details are equal.
 * @param vehicleDetails1 first vehicle details info
 * @param vehicleDetails2 second vehicle details info
 * @returns true when vehicle details are equivalent, false otherwise
 */
const areVehicleDetailsEqual = (vehicleDetails1?: VehicleDetailsType, vehicleDetails2?: VehicleDetailsType) => {
  if (!vehicleDetails1 && !vehicleDetails2) return true; // considered equal when both are undefined
  if (!vehicleDetails1 || !vehicleDetails2) return false; // considered not equal when only one is undefined

  // Equal when all key-value pairs of both contacts details are equal
  return Object.entries(vehicleDetails1)
    .map(([key, val]) => {
      const val2 = vehicleDetails2[key as keyof VehicleDetailsType]; // get value from second vehicle details for this key
      return getDefaultRequiredVal("", val) === getDefaultRequiredVal("", val2);
    })
    .reduce((prevIsEqual, currIsEqual) => prevIsEqual && currIsEqual, true);
};

/**
 * Compare whether or not two application data info are equal.
 * @param data1 first application data info
 * @param data2 second application data info
 * @returns true when application data are equivalent, false otherwise
 */
export const areApplicationDataEqual = (data1: TermOversizeApplication, data2: TermOversizeApplication) => {
  return data1.permitDuration === data2.permitDuration
    && dayjsToLocalStr(data1.startDate, DATE_FORMATS.DATEONLY) === dayjsToLocalStr(data2.startDate, DATE_FORMATS.DATEONLY)
    && dayjsToLocalStr(data1.expiryDate, DATE_FORMATS.DATEONLY) === dayjsToLocalStr(data2.expiryDate, DATE_FORMATS.DATEONLY)
    && areContactDetailsEqual(data1.contactDetails, data2.contactDetails)
    && areVehicleDetailsEqual(data1.vehicleDetails, data2.vehicleDetails)
    && areCommoditiesEqual(data1.commodities, data2.commodities);
};
