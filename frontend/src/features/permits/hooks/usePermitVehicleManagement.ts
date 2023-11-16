import { getDefaultRequiredVal } from "../../../common/helpers/util";
import { VehicleDetails } from "../types/application.d";
import {
  PowerUnit,
  Trailer,
} from "../../manageVehicles/types/managevehicles.d";
import { mapVinToVehicleObject } from "../helpers/mappers";
import {
  useAddPowerUnitMutation,
  useAddTrailerMutation,
  usePowerUnitTypesQuery,
  useTrailerTypesQuery,
  useUpdatePowerUnitMutation,
  useUpdateTrailerMutation,
  useVehiclesQuery,
} from "../../manageVehicles/apiManager/hooks";

export const usePermitVehicleManagement = (companyId: string) => {
  // Mutations used to add/update vehicle details
  const addPowerUnitMutation = useAddPowerUnitMutation();
  const updatePowerUnitMutation = useUpdatePowerUnitMutation();
  const addTrailerMutation = useAddTrailerMutation();
  const updateTrailerMutation = useUpdateTrailerMutation();

  // Queries used to populate select options for vehicle details
  const allVehiclesQuery = useVehiclesQuery(companyId);
  const powerUnitTypesQuery = usePowerUnitTypesQuery();
  const trailerTypesQuery = useTrailerTypesQuery();

  // Vehicle details that have been fetched by vehicle details queries
  const fetchedVehicles = getDefaultRequiredVal([], allVehiclesQuery.data);
  const fetchedPowerUnitTypes = getDefaultRequiredVal(
    [],
    powerUnitTypesQuery.data,
  );
  const fetchedTrailerTypes = getDefaultRequiredVal([], trailerTypesQuery.data);

  const handleSaveVehicle = (vehicleData?: VehicleDetails) => {
    // Check if the "add/update vehicle" checkbox was checked by the user
    if (!vehicleData?.saveVehicle) return;

    // Get the vehicle info from the form
    const vehicle = vehicleData;

    // Check if the vehicle that is to be saved was created from an existing vehicle
    const existingVehicle = mapVinToVehicleObject(fetchedVehicles, vehicle.vin);

    const transformByVehicleType = (
      vehicleFormData: VehicleDetails,
      existingVehicle?: PowerUnit | Trailer,
    ): PowerUnit | Trailer => {
      const defaultPowerUnit: PowerUnit = {
        powerUnitId: "",
        unitNumber: "",
        vin: vehicleFormData.vin,
        plate: vehicleFormData.plate,
        make: vehicleFormData.make,
        year: vehicleFormData.year,
        countryCode: vehicleFormData.countryCode,
        provinceCode: vehicleFormData.provinceCode,
        powerUnitTypeCode: vehicleFormData.vehicleSubType,
      };

      const defaultTrailer: Trailer = {
        trailerId: "",
        unitNumber: "",
        vin: vehicleFormData.vin,
        plate: vehicleFormData.plate,
        make: vehicleFormData.make,
        year: vehicleFormData.year,
        countryCode: vehicleFormData.countryCode,
        provinceCode: vehicleFormData.provinceCode,
        trailerTypeCode: vehicleFormData.vehicleSubType,
      };

      switch (vehicleFormData.vehicleType) {
        case "trailer":
          return {
            ...defaultTrailer,
            trailerId: getDefaultRequiredVal(
              "",
              (existingVehicle as Trailer)?.trailerId,
            ),
            unitNumber: getDefaultRequiredVal("", existingVehicle?.unitNumber),
          } as Trailer;
        case "powerUnit":
        default:
          return {
            ...defaultPowerUnit,
            unitNumber: getDefaultRequiredVal("", existingVehicle?.unitNumber),
            powerUnitId: getDefaultRequiredVal(
              "",
              (existingVehicle as PowerUnit)?.powerUnitId,
            ),
          } as PowerUnit;
      }
    };

    // If the vehicle type is a power unit then create a power unit object
    if (vehicle.vehicleType === "powerUnit") {
      const powerUnit = transformByVehicleType(
        vehicle,
        existingVehicle,
      ) as PowerUnit;

      // Either send a PUT or POST request based on powerUnitID
      if (powerUnit.powerUnitId) {
        updatePowerUnitMutation.mutate({
          powerUnit,
          powerUnitId: powerUnit.powerUnitId,
          companyId,
        });
      } else {
        addPowerUnitMutation.mutate({
          powerUnit,
          companyId,
        });
      }
    } else if (vehicle.vehicleType === "trailer") {
      const trailer = transformByVehicleType(
        vehicle,
        existingVehicle,
      ) as Trailer;

      if (trailer.trailerId) {
        updateTrailerMutation.mutate({
          trailer,
          trailerId: trailer.trailerId,
          companyId,
        });
      } else {
        addTrailerMutation.mutate({
          trailer,
          companyId,
        });
      }
    }
  };

  return {
    handleSaveVehicle,
    powerUnitTypes: fetchedPowerUnitTypes,
    trailerTypes: fetchedTrailerTypes,
    vehicleOptions: fetchedVehicles,
  };
};
