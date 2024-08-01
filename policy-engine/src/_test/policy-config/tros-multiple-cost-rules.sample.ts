import { PolicyDefinition } from '../../types/policy-definition';

export const multipleCostRules: PolicyDefinition = {
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
      rules: [],
      costRules: [
        {
          fact: 'costPerMonth',
          params: {
            cost: 30,
          },
        },
        {
          fact: 'fixedCost',
          params: {
            cost: 15,
          },
        },
      ],
    },
  ],
  globalWeightDefaults: {
    powerUnits: [],
    trailers: [],
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
  globalSizeDefaults: {
    frontProjection: 3,
    rearProjection: 6.5,
    width: 2.6,
    height: 4.15,
    length: 31,
  },
};
