import { useContext, useEffect } from "react";
import { useFormContext } from "react-hook-form";

import "./LOADesignateVehicles.scss";
import { InfoBcGovBanner } from "../../../../../../common/components/banners/InfoBcGovBanner";
import { BANNER_MESSAGES } from "../../../../../../common/constants/bannerMessages";
import OnRouteBCContext from "../../../../../../common/authentication/OnRouteBCContext";
import { applyWhenNotNullable, getDefaultRequiredVal } from "../../../../../../common/helpers/util";
import { PowerUnit, Trailer, VEHICLE_TYPES } from "../../../../../manageVehicles/types/Vehicle";
import { LOAFormData } from "../../../../types/LOAFormData";
import { LOAVehicle } from "../../../../types/LOAVehicle";
import {
  usePowerUnitSubTypesQuery,
  useTrailerSubTypesQuery,
  useVehiclesQuery,
} from "../../../../../manageVehicles/apiManager/hooks";
import { VehicleTable } from "../../../../components/SpecialAuthorizations/LOA/vehicles/VehicleTable";

const getVehicleDetailsForSelected = (
  selectedVehicles: string[],
  vehicleSource: LOAVehicle[],
) => {
  const selectedVehicleIds = new Set(selectedVehicles);
  const detailsOfSelectedIds = vehicleSource.filter(
    vehicle => vehicle.vehicleId && selectedVehicleIds.has(vehicle.vehicleId),
  ).map(vehicle => ({
    vehicleId: vehicle.vehicleId,
    unitNumber: vehicle.unitNumber,
    make: vehicle.make,
    vehicleType: vehicle.vehicleType,
    vin: vehicle.vin,
    plate: vehicle.plate,
    vehicleSubType: vehicle.vehicleSubType,
  }));

  return detailsOfSelectedIds;
};

export const LOADesignateVehicles = () => {
  const { companyId } = useContext(OnRouteBCContext);
  const companyIdStr = applyWhenNotNullable(
    id => `${id}`,
    companyId,
  );

  const { setValue, getValues, watch } = useFormContext<LOAFormData>();

  const selectedPowerUnits = watch("selectedVehicles.powerUnits");
  const selectedTrailers = watch("selectedVehicles.trailers");

  const vehiclesQuery = useVehiclesQuery(companyIdStr);
  const powerUnitSubTypesQuery = usePowerUnitSubTypesQuery();
  const trailerSubTypesQuery = useTrailerSubTypesQuery();
  const powerUnitSubTypes = getDefaultRequiredVal(
    [],
    powerUnitSubTypesQuery.data,
  );

  const trailerSubTypes = getDefaultRequiredVal(
    [],
    trailerSubTypesQuery.data,
  );

  const { data: vehicles } = vehiclesQuery;
  const powerUnits = getDefaultRequiredVal([], vehicles)
    .filter(vehicle => vehicle.vehicleType === VEHICLE_TYPES.POWER_UNIT)
    .map((vehicle) => ({
      vehicleId: (vehicle as PowerUnit).powerUnitId,
      unitNumber: vehicle.unitNumber,
      make: vehicle.make,
      vin: vehicle.vin,
      plate: vehicle.plate,
      vehicleType: VEHICLE_TYPES.POWER_UNIT,
      vehicleSubType: {
        typeCode: (vehicle as PowerUnit).powerUnitTypeCode,
        type: powerUnitSubTypes
          .find(subType => subType.typeCode === (vehicle as PowerUnit).powerUnitTypeCode)?.type,
      },
    })) as LOAVehicle[];
  
  const trailers = getDefaultRequiredVal([], vehicles)
    .filter(vehicle => vehicle.vehicleType === VEHICLE_TYPES.TRAILER)
    .map((vehicle) => ({
      vehicleId: (vehicle as Trailer).trailerId,
      unitNumber: vehicle.unitNumber,
      make: vehicle.make,
      vin: vehicle.vin,
      plate: vehicle.plate,
      vehicleType: VEHICLE_TYPES.TRAILER,
      vehicleSubType: {
        typeCode: (vehicle as Trailer).trailerTypeCode,
        type: trailerSubTypes
          .find(subType => subType.typeCode === (vehicle as Trailer).trailerTypeCode)?.type,
      },
    })) as LOAVehicle[];

  useEffect(() => {
    // If the fetched power units have ones that have been selected, fill the form data with vehicle information
    const selectedPowerUnits = getValues("selectedVehicles.powerUnits");
    const detailsOfSelectedIds = getVehicleDetailsForSelected(
      Object.keys(selectedPowerUnits),
      powerUnits,
    );

    setValue(
      "selectedVehicles.powerUnits",
      Object.fromEntries(detailsOfSelectedIds.map(detail => [detail.vehicleId, {...detail}])),
    );
  }, [powerUnits, powerUnitSubTypes]);

  useEffect(() => {
    // If the fetched trailers have ones that have been selected, fill the form data with vehicle information
    const selectedTrailers = getValues("selectedVehicles.trailers");
    const detailsOfSelectedIds = getVehicleDetailsForSelected(
      Object.keys(selectedTrailers),
      trailers,
    );

    setValue(
      "selectedVehicles.trailers",
      Object.fromEntries(detailsOfSelectedIds.map(detail => [detail.vehicleId, {...detail}])),
    );
  }, [trailers, trailerSubTypes]);

  
  const selectionForPowerUnitTable = Object.fromEntries(
    Object.keys(selectedPowerUnits).map(id => [`${VEHICLE_TYPES.POWER_UNIT}-${id}`, true]),
  );

  const selectionForTrailerTable = Object.fromEntries(
    Object.keys(selectedTrailers).map(id => [`${VEHICLE_TYPES.TRAILER}-${id}`, true]),
  );

  const handlePowerUnitSelectionChange = (
    selection: {
      [id: string]: boolean;
    },
  ) => {
    const updatedSelection = Object.entries(selection)
      .filter((selectionRow) => selectionRow[1])
      .map(([id]) => {
        // selection row ids are in the format "vehicleType-id" (eg. "powerUnit-1")
        return id.split("-")[1]; // we only want the vehicleId part (ie. "1" in the example above)
      });

    const detailsOfSelectedIds = getVehicleDetailsForSelected(updatedSelection, powerUnits);
    setValue(
      "selectedVehicles.powerUnits",
      Object.fromEntries(detailsOfSelectedIds.map(detail => [detail.vehicleId, {...detail}])),
    );
  };

  const handleTrailerSelectionChange = (
    selection: {
      [id: string]: boolean;
    },
  ) => {
    const updatedSelection = Object.entries(selection)
      .filter((selectionRow) => selectionRow[1])
      .map(([id]) => {
        // selection row ids are in the format "vehicleType-id" (eg. "trailer-1")
        return id.split("-")[1]; // we only want the vehicleId part (ie. "1" in the example above)
      });

    const detailsOfSelectedIds = getVehicleDetailsForSelected(updatedSelection, trailers);
    setValue(
      "selectedVehicles.trailers",
      Object.fromEntries(detailsOfSelectedIds.map(detail => [detail.vehicleId, {...detail}])),
    );
  };

  return (
    <div className="loa-designate-vehicles">
      <div className="loa-designate-vehicles__header">
        Select Vehicle(s) for LOA
      </div>

      <InfoBcGovBanner
        msg={BANNER_MESSAGES.SELECT_VEHICLES_LOA}
        additionalInfo={
          <span className="loa-designate-vehicles__info-message">
            {BANNER_MESSAGES.SELECT_VEHICLES_LOA_INFO}
          </span>
        }
        className="loa-designate-vehicles__info-banner"
      />

      <VehicleTable
        vehicles={powerUnits}
        selectedVehicles={selectionForPowerUnitTable}
        enablePagination={true}
        enableTopToolbar={true}
        onUpdateSelection={handlePowerUnitSelectionChange}
      />

      <VehicleTable
        vehicles={trailers}
        selectedVehicles={selectionForTrailerTable}
        enablePagination={true}
        enableTopToolbar={true}
        onUpdateSelection={handleTrailerSelectionChange}
      />
    </div>
  );
};
