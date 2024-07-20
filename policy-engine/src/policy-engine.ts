import {
  PolicyDefinition,
  PermitType,
  Commodity,
  Vehicle,
  VehicleType,
  SizeDimension,
  Trailer,
  RegionSizeOverride,
} from 'onroute-policy-engine/types';
import { extractIdentifiedObjects } from './helper/lists.helper';
import { Engine, EngineResult } from 'json-rules-engine';
import { getRulesEngines } from './helper/rules-engine.helper';
import { ValidationResults } from './validation-results';
import { ValidationResult } from './validation-result';
import { addRuntimeFacts, transformPermitFacts } from './helper/facts.helper';
import {
  ValidationResultType,
  ValidationResultCode,
  RelativePosition,
} from 'onroute-policy-engine/enum';

/** Class representing commercial vehicle policy. */
export class Policy {
  /** Object representation of policy definition and rules. */
  policyDefinition: PolicyDefinition;

  /**
   * Map of json-rules-engine instances, one for each
   * permit type defined in the permit definition. Keyed
   * on permit type id.
   */
  rulesEngines: Map<string, Engine>;

  /**
   * Creates a new Policy object.
   * @param definition Policy definition to validate permits against
   */
  constructor(definition: PolicyDefinition) {
    this.policyDefinition = definition;

    this.rulesEngines = getRulesEngines(this);
  }

  /**
   * Validates a permit application against the policy definition.
   * @param permit The permit application to validate against policy
   * @returns Results of the validation of the permit application
   */
  async validate(permit: any): Promise<ValidationResults> {
    const engine = this.rulesEngines.get(permit.permitType);
    if (!engine) {
      // If the permit type being validated has no configuration in the
      // policy definition, there will be no engine for it. Return with
      // a single violation result.
      const validationResult: ValidationResults = new ValidationResults();
      validationResult.violations.push(
        new ValidationResult(
          ValidationResultType.Violation,
          ValidationResultCode.PermitTypeUnknown,
          `Permit type ${permit.permitType} unknown`,
        ),
      );
      return validationResult;
    } else {
      // Add facts specific to this run of the validation (e.g. validation
      // date for comparison against start date of the permit).
      addRuntimeFacts(engine);

      const permitFacts = transformPermitFacts(permit);

      // Run the json-rules-engine against the permit facts
      const engineResult: EngineResult = await engine.run(permitFacts);

      // Wrap the json-rules-engine result in a ValidationResult object
      return new ValidationResults(engineResult);
    }
  }

  /**
   * Gets a list of all configured permit types in the policy definition.
   * @returns Map of permit type IDs to permit type names.
   */
  getPermitTypes(): Map<string, string> {
    const permitTypes = extractIdentifiedObjects(
      this.policyDefinition.permitTypes,
    );
    return permitTypes;
  }

  /**
   * Gets a list of all configured geographic regions in the policy definition.
   * @returns Map of geographic region IDs to region names.
   */
  getGeographicRegions(): Map<string, string> {
    const geographicRegions = extractIdentifiedObjects(
      this.policyDefinition.geographicRegions,
    );
    return geographicRegions;
  }

  /**
   * Gets a list of all configured commodities in the policy definition.
   * @param permitTypeId Return only commodities valid for this permit type.
   *   If not supplied, return all commodities configured in policy. If permit
   *   type does not require commodity (e.g. 'TROS'), return all commodities.
   * @returns Map of commodity IDs to commodity names.
   */
  getCommodities(permitTypeId?: string): Map<string, string> {
    const permitType = this.getPermitTypeDefinition(permitTypeId);
    const commodities = extractIdentifiedObjects(
      this.policyDefinition.commodities,
      permitType?.allowedCommodities,
    );
    return commodities;
  }

  /**
   * Gets a list of all allowable power unit types for the given permit type
   * and commodity.
   * @param permitTypeId ID of the permit type to get power units for
   * @param commodityId ID of the commodity to get power units for
   * @returns Map of power unit IDs to power unit names.
   */
  getPermittablePowerUnitTypes(
    permitTypeId: string,
    commodityId: string,
  ): Map<string, string> {
    let puTypes = new Map<string, string>();
    if (permitTypeId && commodityId) {
      const permitType = this.getPermitTypeDefinition(permitTypeId);
      if (permitType) {
        if (permitType.commodityRequired) {
          // If commodity is not required, this method cannot calculate the
          // permittable power unit types since they will not be configured.
          const allowableCommodities = this.getCommodities(permitTypeId);
          if (allowableCommodities.has(commodityId)) {
            // If the commodity is not allowed for the permit type, no power
            // units are allowed.
            const commodity = this.getCommodityDefinition(commodityId);
            if (commodity) {
              // If commodity is null, this indicates a configuration error.
              const puTypeIds: Array<string> | undefined =
                commodity.powerUnits?.map((p) => p.type);
              puTypes = extractIdentifiedObjects(
                this.policyDefinition.vehicleTypes.powerUnitTypes,
                puTypeIds,
              );
            }
          }
        }
      }
    }
    return puTypes;
  }

  /**
   * Gets a list of all configured vehicles for the given permit type and commodity.
   * Includes both power units and trailers in a single return value.
   * @param permitTypeId ID of the permit type to get vehicles for
   * @param commodityId ID of the commodity to get vehicles for
   * @returns Array of vehicle objects for the permit type and commodityId
   */
  getAllVehiclesForCommodity(
    permitTypeId: string,
    commodityId: string,
  ): Array<Vehicle> {
    let vehicles: Array<Vehicle> = new Array<Vehicle>();
    if (permitTypeId && commodityId) {
      const permitType = this.getPermitTypeDefinition(permitTypeId);
      if (permitType) {
        if (permitType.commodityRequired) {
          const allowableCommodities = this.getCommodities(permitTypeId);
          if (allowableCommodities.has(commodityId)) {
            const commodity = this.getCommodityDefinition(commodityId);
            if (commodity) {
              let pu: Array<Vehicle> | undefined = commodity.powerUnits;
              if (!pu) {
                pu = new Array<Vehicle>();
              }
              let tr: Array<Vehicle> | undefined = commodity.trailers;
              if (!tr) {
                tr = new Array<Vehicle>();
              }
              vehicles = pu.concat(tr);
            }
          }
        }
      }
    }
    return vehicles;
  }

  /**
   * Gets the next permittable vehicles based on the supplied permit type,
   * commodity, and current configuration.
   * If the permit type does not require commodity or if the commodity
   * is not valid for the permit type, this will return an empty map
   * (meaning no vehicles are permittable).
   * @param permitTypeId ID of the permit type to get vehicles for
   * @param commodityId ID of the commodity to get vehicles for
   * @param currentConfiguration Current vehicle configuration to which will be
   * added the next permittable vehicle
   * @returns Map of vehicle ID to vehicle name. Includes both power units and
   * trailers in a single return value (if applicable).
   */
  getNextPermittableVehicles(
    permitTypeId: string,
    commodityId: string,
    currentConfiguration: Array<string>,
  ): Map<string, string> {
    let vehicleTypes = new Map<string, string>();
    if (permitTypeId && commodityId && currentConfiguration) {
      const allVehiclesForCommodity: Array<Vehicle> =
        this.getAllVehiclesForCommodity(permitTypeId, commodityId);
      if (allVehiclesForCommodity.length > 0) {
        let vehicleTypeIds: Array<string>;
        if (currentConfiguration.length == 0) {
          // If the current configuration has no vehicles, return only those vehicles
          // that have an empty canFollow array (typically power units).
          vehicleTypeIds = allVehiclesForCommodity
            .filter((v) => v.canFollow.length == 0)
            .map((v) => v.type);
        } else {
          const lastVehicleType =
            currentConfiguration[currentConfiguration.length - 1];
          vehicleTypeIds = allVehiclesForCommodity
            .filter((v) => v.canFollow.includes(lastVehicleType))
            .map((v) => v.type);
        }
        const allVehicles: Array<VehicleType> =
          this.policyDefinition.vehicleTypes.powerUnitTypes.concat(
            this.policyDefinition.vehicleTypes.trailerTypes,
          );
        vehicleTypes = extractIdentifiedObjects(allVehicles, vehicleTypeIds);
      }
    }
    return vehicleTypes;
  }

  /**
   * Returns whether the supplied configuration is valid for the given permit type
   * and commodity. If the permit type does not require a commodity, this method
   * will return false. This will not validate incomplete configurations - if the
   * current configuration has only a power unit this will return false even if the
   * power unit is acceptable because there is no trailer which is mandatory.
   * If this is called for a permit type that does not require commodity, or with
   * a commodity not permitted for the permit type, it will return false.
   * @param permitTypeId ID of the permit type to validate the configuration against
   * @param commodityId ID of the commodity used for the configuration
   * @param currentConfiguration Current vehicle configuration to validate
   */
  isConfigurationValid(
    permitTypeId: string,
    commodityId: string,
    currentConfiguration: Array<string>,
  ): boolean {
    let isValid: boolean = false;

    const runningConfig: Array<string> = new Array<string>();
    for (let i = 0; i < currentConfiguration.length; i++) {
      // Note getNextPermittableVehicles will always return an empty map if either the
      // permit type or commodity is invalid
      const nextVehicles: Map<string, string> = this.getNextPermittableVehicles(
        permitTypeId,
        commodityId,
        runningConfig,
      );
      if (nextVehicles.has(currentConfiguration[i])) {
        // The next vehicle in the configuration is permittable as per policy
        runningConfig.push(currentConfiguration[i]);
        const permitType = this.getPermitTypeDefinition(permitTypeId);
        if (permitType?.sizeDimensionRequired) {
          // Size dimension is required for this permit type, so we need to
          // flip the isValid flag only if we find a trailer that counts
          // for size dimensions
          const vehicleType =
            this.policyDefinition.vehicleTypes.trailerTypes?.find(
              (v) => v.id == currentConfiguration[i],
            );
          if (!vehicleType?.ignoreForSizeDimensions) {
            isValid = true;
          }
        } else {
          // Size dimensions are not required for this permit type, so there are
          // no requirements with respect to what trailers are permitted.
          isValid = true;
        }
      } else {
        // The next vehicle in the list is not permittable, or there are no
        // permittable vehicles at all in the list.
        isValid = false;
        break;
      }
    }
    return isValid;
  }

  /**
   * Gets the maximum size dimensions for a given permit type, commodity,
   * and vehicle configuration. A vehicle configuration's size dimension is
   * dictated by the configuration on the trailer. For configurations that
   * are just a power unit, a pseudo trailer type 'NONE' is used and the
   * size dimension is configured on that. Accessory category trailers
   * (e.g. jeeps and boosters) are not used for configuration since they
   * do not impact the size dimension in policy.
   * @param permitTypeId ID of the permit type to get size dimension for
   * @param commodityId ID of the commodity to get size dimension for
   * @param currentConfiguration Current vehicle configuration to get size dimension for
   * @param regions List of regions the vehicle will be traveling in. If not
   * supplied this defaults to the most restrictive size dimension (if multiple
   * are configured).
   * @returns SizeDimension for the given permit type, commodity, and configuration
   */
  getSizeDimension(
    permitTypeId: string,
    commodityId: string,
    configuration: Array<string>,
    regions?: Array<string>,
  ): SizeDimension | null {
    // Initialize the sizeDimension with global defaults
    let sizeDimension: SizeDimension | null = null;

    // Validate that the configuration is permittable
    if (
      this.isConfigurationValid(permitTypeId, commodityId, configuration)
    ) {
      // Get the last trailer in the configuration that can be used for size calculations
      const sizeTrailer: string | undefined = Array.from(configuration)
        .reverse()
        .find((vehicleId) => {
          const trailerType =
            this.policyDefinition.vehicleTypes.trailerTypes?.find(
              (v) => v.id == vehicleId,
            );
          return !trailerType?.ignoreForSizeDimensions;
        });

      if (sizeTrailer) {
        // Get the trailer size dimension array for the commodity
        const commodity = this.getCommodityDefinition(commodityId);
        const trailer: Trailer | undefined = commodity?.trailers?.find(
          (t) => t.type == sizeTrailer,
        );
        let sizeDimensions: Array<SizeDimension>;
        if (
          trailer &&
          trailer.sizeDimensions &&
          trailer.sizeDimensions.length > 0
        ) {
          sizeDimensions = trailer.sizeDimensions;
        } else {
          sizeDimensions = new Array<SizeDimension>();
        }

        let sizeDimensionConfigured: SizeDimension | null = null;
        if (sizeDimensions.length == 0) {
          // If there are no dimensions configured but the configuration is still
          // valid, we inherit the size dimensions from the global defaults.
          sizeDimensionConfigured = this.policyDefinition.globalSizeDefaults;
        } else if (sizeDimensions.length == 1) {
          sizeDimensionConfigured = sizeDimensions[0];
        } else {
          // If multiple size dimensions, select the first one matching all modifiers
          sizeDimensionConfigured = this.selectCorrectSizeDimension(
            sizeDimensions,
            configuration,
            sizeTrailer,
          );
        }

        if (sizeDimensionConfigured) {
          // Adjust the size dimensions for the regions travelled, if needed
          if (!regions) {
            // If we are not provided a list of regions, assume we are
            // traveling through all regions (will take the most restrictive
            // of all dimensions in all cases).
            console.log('Assuming all regions for size dimension lookup');
            regions = this.policyDefinition.geographicRegions.map((g) => g.id);
          } else {
            console.log('Using ' + regions + ' as regions for size lookup');
          }
          const valueOverrides: Array<RegionSizeOverride> = [];
          regions?.forEach((r) => {
            let valueOverride: RegionSizeOverride;
            // Check to see if this region has specific size dimensions
            let regionOverride = sizeDimensionConfigured.regions?.find((cr) => cr.region == r);
            if (!regionOverride) {
              // The region travelled does not have an override, so it assumes
              // the dimensions of the base size dimension configured.
              valueOverride = {
                region: r,
                height: sizeDimensionConfigured.height ?? this.policyDefinition.globalSizeDefaults.height ?? 0,
                width: sizeDimensionConfigured.width ?? this.policyDefinition.globalSizeDefaults.width ?? 0,
                length: sizeDimensionConfigured.length ?? this.policyDefinition.globalSizeDefaults.length ?? 0,
              }
            } else {
              // There is a region override with one or more dimensions. Use this
              // value preferentially, using base dimension and global default in
              // descending order of preference.
              valueOverride = {
                region: r,
                height: regionOverride.height ?? sizeDimensionConfigured.height ?? this.policyDefinition.globalSizeDefaults.height ?? 0,
                width: regionOverride.width ?? sizeDimensionConfigured.width ?? this.policyDefinition.globalSizeDefaults.width ?? 0,
                length: regionOverride.length ?? sizeDimensionConfigured.length ?? this.policyDefinition.globalSizeDefaults.length ?? 0,
              }
            }
            valueOverrides.push(valueOverride);
          });

          // At this point we have a complete set of size dimensions for each of
          // the regions that will be traversed. Take the minimum value of each
          // dimension for the final value.
          const minimumOverrides = valueOverrides.reduce((accumulator, currentValue) => {

            if (typeof accumulator.height === 'undefined') {
              accumulator.height = currentValue.height ?? 0;
            }
            if (typeof accumulator.width === 'undefined') {
              accumulator.width = currentValue.width ?? 0;
            }
            if (typeof accumulator.length === 'undefined') {
              accumulator.length = currentValue.length ?? 0;
            }

            accumulator.height = Math.min(accumulator.height, currentValue.height ?? 0);
            accumulator.width = Math.min(accumulator.width, currentValue.width ?? 0);
            accumulator.length = Math.min(accumulator.length, currentValue.length ?? 0);
            return accumulator;
          }, { 'region': '' });

          sizeDimension = {
            rearProjection: sizeDimensionConfigured.rearProjection ?? this.policyDefinition.globalSizeDefaults.rearProjection,
            frontProjection: sizeDimensionConfigured.frontProjection ?? this.policyDefinition.globalSizeDefaults.frontProjection,
            height: minimumOverrides.height ?? sizeDimensionConfigured.height ?? this.policyDefinition.globalSizeDefaults.height,
            width: minimumOverrides.width ?? sizeDimensionConfigured.width ?? this.policyDefinition.globalSizeDefaults.width,
            length: minimumOverrides.length ?? sizeDimensionConfigured.length ?? this.policyDefinition.globalSizeDefaults.length,
          }
        } else {
          console.log('Size dimension not configured for trailer');
        }
      } else {
        console.log('Could not locate trailer to use for size dimension');
      }
    } else {
      console.log('Configuration is invalid, returning null size dimension');
    }

    return sizeDimension;
  }

  /**
   * Selects the correct size dimension from a list of potential candidates, based
   * on the modifier of each dimension. If none of the modifiers match, returns
   * null.
   * @param sizeDimensions Size dimension options to choose from
   * @param currentConfiguration The full vehicle configuration
   */
  selectCorrectSizeDimension(
    sizeDimensions: Array<SizeDimension>,
    configuration: Array<string>,
    sizeTrailer: string,
  ): SizeDimension | null {
    let matchingDimension: SizeDimension | null = null;

    if (
      sizeDimensions?.length > 0 &&
      configuration?.length > 0
    ) {
      for (let i = 0; i < sizeDimensions.length; i++) {
        if (!sizeDimensions[i].modifiers) {
          // This dimension has no modifiers, so it is the default if none of
          // the other specific modifiers match.
          matchingDimension = sizeDimensions[i];
          console.log('Using default size dimension, no modifiers specified');
        } else {
          const sizeTrailerIndex = configuration.findIndex((c) => sizeTrailer == c);
          const isMatch: boolean | undefined = sizeDimensions[i].modifiers?.every(
            (m) => {
              if (!m.type) {
                return false;
              }
              switch (m.position) {
                case RelativePosition.First.toString():
                  return configuration[0] == m.type;
                case RelativePosition.Last.toString():
                  return configuration[configuration.length - 1] == m.type;
                case RelativePosition.Before.toString():
                  return configuration[sizeTrailerIndex - 1] == m.type;
                case RelativePosition.After.toString():
                  return configuration[sizeTrailerIndex + 1] == m.type;
                default:
                  return false;
              }
            },
          );
          // As soon as we find a dimension with matching modifiers,
          // set it and return it.
          if (isMatch) {
            matchingDimension = sizeDimensions[i];
            break;
          }
        }
      }
    } else {
      console.log('Either size dimensions or configuration array is null, no matching dimension returned');
    }
    return matchingDimension;
  }

  /**
   * Gets a list of all configured power unit types in the policy definition.
   * @returns Map of power unit type IDs to power unit type names.
   */
  getPowerUnitTypes(): Map<string, string> {
    const powerUnitTypes = extractIdentifiedObjects(
      this.policyDefinition.vehicleTypes.powerUnitTypes,
    );
    return powerUnitTypes;
  }

  /**
   * Gets a list of all configured trailer types in the policy definition.
   * @returns Map of trailer type IDs to trailer type names.
   */
  getTrailerTypes(): Map<string, string> {
    const trailerTypes = extractIdentifiedObjects(
      this.policyDefinition.vehicleTypes.trailerTypes,
    );
    return trailerTypes;
  }

  /**
   * Gets a full PermitType definition by ID.
   * @param type Type ID of the permit definition to return.
   * @returns PermitType definition for the supplied ID.
   */
  getPermitTypeDefinition(type?: string): PermitType | null {
    let permitType: PermitType | undefined;
    if (this.policyDefinition.permitTypes) {
      permitType = this.policyDefinition.permitTypes.find((p) => p.id === type);
    }

    if (permitType) {
      return permitType;
    } else {
      return null;
    }
  }

  /**
   * Gets a full Commodity definition by ID
   * @param type Type ID of the commodity to return.
   * @returns Commodity definition for the supplied ID.
   */
  getCommodityDefinition(type?: string): Commodity | null {
    let commodity: Commodity | undefined;
    if (this.policyDefinition.commodities) {
      commodity = this.policyDefinition.commodities.find((c) => c.id === type);
    }

    if (commodity) {
      return commodity;
    } else {
      return null;
    }
  }
}
