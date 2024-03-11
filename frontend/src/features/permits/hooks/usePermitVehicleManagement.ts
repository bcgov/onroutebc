import { getDefaultRequiredVal } from "../../../common/helpers/util";
import { mapToVehicleObjectById } from "../helpers/mappers";
import { Nullable } from "../../../common/types/common";
import { getDefaultVehicleDetails } from "../helpers/getDefaultApplicationFormData";
import { PermitVehicleDetails } from "../types/PermitVehicleDetails";
import {
  PowerUnit,
  Trailer,
  VEHICLE_TYPES,
  Vehicle,
  VehicleType,
} from "../../manageVehicles/types/Vehicle";

import {
  useAddPowerUnitMutation,
  useAddTrailerMutation,
  usePowerUnitSubTypesQuery,
  useTrailerSubTypesQuery,
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
  const powerUnitSubTypesQuery = usePowerUnitSubTypesQuery();
  const trailerSubTypesQuery = useTrailerSubTypesQuery();

  // Vehicle details that have been fetched by vehicle details queries
  const fetchedVehicles = getDefaultRequiredVal([], allVehiclesQuery.data);
  const fetchedPowerUnitSubTypes = getDefaultRequiredVal(
    [],
    powerUnitSubTypesQuery.data,
  );
  const fetchedTrailerSubTypes = getDefaultRequiredVal(
    [],
    trailerSubTypesQuery.data,
  );

  const handleSaveVehicle = async (
    vehicleData?: Nullable<PermitVehicleDetails>,
  ): Promise<Nullable<PermitVehicleDetails>> => {
    // Check if the "add/update vehicle" checkbox was checked by the user
    if (!vehicleData?.saveVehicle) return undefined;

    // Get the vehicle info from the form
    const vehicle = vehicleData;

    // Check if the vehicle that is to be saved was created from an existing vehicle
    const vehicleId = vehicle.vehicleId;

    const existingVehicle = mapToVehicleObjectById(
      fetchedVehicles,
      vehicle.vehicleType as VehicleType,
      vehicleId,
    );

    const transformByVehicleType = (
      vehicleFormData: PermitVehicleDetails,
      existingVehicle?: Vehicle,
    ): Vehicle => {
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
        case VEHICLE_TYPES.TRAILER:
          return {
            ...defaultTrailer,
            trailerId: getDefaultRequiredVal(
              "",
              (existingVehicle as Trailer)?.trailerId,
            ),
            unitNumber: getDefaultRequiredVal(
              "",
              existingVehicle?.unitNumber,
              vehicleFormData.unitNumber,
            ),
          } as Trailer;
        case VEHICLE_TYPES.POWER_UNIT:
        default:
          return {
            ...defaultPowerUnit,
            unitNumber: getDefaultRequiredVal(
              "",
              existingVehicle?.unitNumber,
              vehicleFormData.unitNumber,
            ),
            powerUnitId: getDefaultRequiredVal(
              "",
              (existingVehicle as PowerUnit)?.powerUnitId,
            ),
          } as PowerUnit;
      }
    };

    const modifyVehicleSuccess = (status: number) =>
      status === 201 || status === 200;

    // If the vehicle type is a power unit then create a power unit object
    if (vehicle.vehicleType === VEHICLE_TYPES.POWER_UNIT) {
      const powerUnit = transformByVehicleType(
        vehicle,
        existingVehicle,
      ) as PowerUnit;

      // Either send a PUT or POST request based on powerUnitId
      const res = powerUnit.powerUnitId
        ? await updatePowerUnitMutation.mutateAsync({
            powerUnit,
            powerUnitId: powerUnit.powerUnitId,
            companyId,
          })
        : await addPowerUnitMutation.mutateAsync({
            powerUnit: {
              ...powerUnit,
              powerUnitId: getDefaultRequiredVal("", vehicle.vehicleId),
            },
            companyId,
          });

      if (!modifyVehicleSuccess(res.status)) return null;

      const { powerUnitId, powerUnitTypeCode, ...restOfPowerUnit } = res.data;
      return getDefaultVehicleDetails({
        ...restOfPowerUnit,
        vehicleId: powerUnitId,
        vehicleSubType: powerUnitTypeCode,
        vehicleType: VEHICLE_TYPES.POWER_UNIT,
      });
    }

    if (vehicle.vehicleType === VEHICLE_TYPES.TRAILER) {
      const trailer = transformByVehicleType(
        vehicle,
        existingVehicle,
      ) as Trailer;

      // Either send a PUT or POST request based on trailerId
      const res = trailer.trailerId
        ? await updateTrailerMutation.mutateAsync({
            trailer,
            trailerId: trailer.trailerId,
            companyId,
          })
        : await addTrailerMutation.mutateAsync({
            trailer: {
              ...trailer,
              trailerId: getDefaultRequiredVal("", vehicle.vehicleId),
            },
            companyId,
          });

      if (!modifyVehicleSuccess(res.status)) return null;

      const { trailerId, trailerTypeCode, ...restOfTrailer } = res.data;
      return getDefaultRequiredVal({
        ...restOfTrailer,
        vehicleId: trailerId,
        vehicleSubType: trailerTypeCode,
        vehicleType: VEHICLE_TYPES.TRAILER,
      });
    }

    return undefined;
  };

  return {
    handleSaveVehicle,
    powerUnitSubTypes: fetchedPowerUnitSubTypes,
    trailerSubTypes: fetchedTrailerSubTypes,
    vehicleOptions: fetchedVehicles,
  };
};
