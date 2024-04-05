import PolicyDefinition from '../../src/interface/policy-definition.interface';

export const allEventTypes: PolicyDefinition = {
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
      allowedVehicles: [
        'trucktractor',
        'truck',
        'semi',
        'platform',
        'ogoilfieldsemi',
      ],
      rules: [
        {
          conditions: {
            not: {
              fact: 'permitData',
              path: '$.duration',
              operator: 'equal',
              value: 31,
            },
          },
          event: {
            type: 'violation',
            params: {
              message: 'Violation A',
            },
          },
        },
        {
          conditions: {
            not: {
              fact: 'permitData',
              path: '$.duration',
              operator: 'equal',
              value: 32,
            },
          },
          event: {
            type: 'requirement',
            params: {
              message: 'Requirement A',
            },
          },
        },
        {
          conditions: {
            not: {
              fact: 'permitData',
              path: '$.duration',
              operator: 'equal',
              value: 33,
            },
          },
          event: {
            type: 'warning',
            params: {
              message: 'Warning A',
            },
          },
        },
        {
          conditions: {
            not: {
              fact: 'permitData',
              path: '$.duration',
              operator: 'equal',
              value: 34,
            },
          },
          event: {
            type: 'message',
            params: {
              message: 'Message A',
            },
          },
        },
        {
          conditions: {
            not: {
              fact: 'permitData',
              path: '$.duration',
              operator: 'equal',
              value: 35,
            },
          },
          event: {
            type: 'message',
            params: {
              invalid_message: 'Message B',
            },
          },
        },
        {
          conditions: {
            not: {
              fact: 'permitData',
              path: '$.duration',
              operator: 'equal',
              value: 35,
            },
          },
          event: {
            type: 'message',
          },
        },
        {
          conditions: {
            not: {
              fact: 'permitData',
              path: '$.duration',
              operator: 'equal',
              value: 36,
            },
          },
          event: {
            type: '__invalid',
            params: {
              message: 'Invalid A',
            },
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
