import { VehicleDetails } from './permit.template.interface';

export interface FullNamesForDgen {
  vehicleTypeName: string;
  vehicleSubTypeName: string;
  mailingCountryName: string;
  mailingProvinceName: string;
  vehicleCountryName: string;
  vehicleProvinceName: string;
  permitName: string;
  vehicleConfigurationTrailers?: VehicleDetails[];
  commodityTypeName: string;
}
