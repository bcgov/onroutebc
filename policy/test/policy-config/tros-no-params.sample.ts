import { PolicyDefinition } from '../../src/types/policy-definition.type';

export const trosNoParamsSample: PolicyDefinition = {
  version: '2024.03.18.001',
  geographicRegions: [],
  commonRules: [],
  permitTypes: [
    {
      id: 'TROS',
      name: 'Term Oversize',
      routingRequired: false,
      weightDimensionRequired: false,
      sizeDimensionRequired: false,
      commodityRequired: false,
      allowedVehicles: [],
      rules: [
        {
          conditions: {
            not: {
              fact: 'permitData.vehicleDetails.vehicleSubType',
              operator: 'in',
              value: {
                fact: 'allowedVehicles',
              },
            },
          },
          event: {
            type: 'violation',
          },
        },
      ],
    },
  ],
  globalWeightDefaults: {
    powerUnits: [],
    trailers: [],
  },
  globalSizeDefaults: {
    frontProjection: 3,
    rearProjection: 6.5,
    width: 2.6,
    height: 4.15,
    length: 31,
  },
  vehicleCategories: {
    trailerCategories: [],
    powerUnitCategories: [],
  },
  vehicleTypes: {
    powerUnitTypes: [],
    trailerTypes: [],
  },
  commodities: [],
};
