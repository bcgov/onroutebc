import { PolicyDefinition } from '../../types/policy-definition';

export const stosPolicyConfig: PolicyDefinition = {
  version: '2024.03.18.001',
  geographicRegions: [
    {
      id: 'LMN',
      name: 'Lower Mainland',
    },
    {
      id: 'KTN',
      name: 'Kootenay',
    },
    {
      id: 'PCE',
      name: 'Peace',
    },
    {
      id: 'BCD',
      name: 'BC Default',
    },
  ],
  commonRules: [],
  permitTypes: [
    {
      id: 'STOS',
      name: 'Single Trip Oversize',
      routingRequired: true,
      weightDimensionRequired: false,
      sizeDimensionRequired: true,
      commodityRequired: true,
      allowedCommodities: ['EMPTYXX', 'BRGBEAM', 'AUTOCRR', 'BRSHCUT'],
      allowedVehicles: [
        'DOLLIES',
        'FEBGHSE',
        'FECVYER',
        'FEDRMMX',
        'FEPNYTR',
        'FESEMTR',
        'FEWHELR',
        'REDIMIX',
        'CONCRET',
        'CRAFTAT',
        'CRAFTMB',
        'GRADERS',
        'MUNFITR',
        'OGOILSW',
        'OGSERVC',
        'OGSRRAH',
        'PICKRTT',
        'TOWVEHC',
      ],
      rules: [
        {
          conditions: {
            any: [
              {
                not: {
                  fact: 'permitData.permitDuration',
                  operator: 'lessThanInclusive',
                  value: 7,
                },
              },
              {
                not: {
                  fact: 'permitData.permitDuration',
                  operator: 'greaterThan',
                  value: 0,
                },
              },
            ],
          },
          event: {
            type: 'violation',
            params: {
              message: 'Duration must be 7 days or less',
              code: 'field-validation-error',
              fieldReference: 'permitData.permitDuration',
            },
          },
        },
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
            params: {
              message: 'Vehicle type not permittable for this permit type',
              code: 'field-validation-error',
              fieldReference: 'permitData.vehicleDetails.vehicleSubType',
            },
          },
        },
      ],
      costRules: [
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
    trailerCategories: [
      {
        id: 'trailer',
        name: 'Default trailer category',
      },
      {
        id: 'accessory',
        name: 'Accessory trailer such as jeep or booster, to be used alongside other trailers. Not permittable on its own as a trailer in a combination.',
      },
      {
        id: 'pseudo',
        name: 'Placeholder for a trailer in a combination with no trailer (such as when a brushcutter is permitted with no trailer).',
      },
    ],
    powerUnitCategories: [
      {
        id: 'powerunit',
        name: 'Default power unit category',
      },
    ],
  },
  vehicleTypes: {
    powerUnitTypes: [
      {
        id: 'BUSCRUM',
        name: 'Buses/Crummies',
        category: 'powerunit',
      },
      {
        id: 'BUSTRLR',
        name: 'Intercity Buses (Pulling Pony Trailers)',
        category: 'powerunit',
      },
      {
        id: 'CONCRET',
        name: 'Concrete Pumper Trucks',
        category: 'powerunit',
      },
      {
        id: 'CRAFTAT',
        name: 'Cranes, Rubber-Tired Loaders, Firetrucks - All Terrain',
        category: 'powerunit',
      },
      {
        id: 'CRAFTMB',
        name: 'Cranes, Rubber-Tired Loaders, Firetrucks - Mobile',
        category: 'powerunit',
      },
      {
        id: 'DDCKBUS',
        name: 'Double Decker Buses',
        category: 'powerunit',
      },
      {
        id: 'FARMVEH',
        name: 'Farm Vehicles',
        category: 'powerunit',
      },
      {
        id: 'GRADERS',
        name: 'Fixed Equipment - Trucks/Graders etc.',
        category: 'powerunit',
      },
      {
        id: 'LCVRMDB',
        name: 'Long Combination Vehicles (LCV) - Rocky Mountain Doubles',
        category: 'powerunit',
      },
      {
        id: 'LCVTPDB',
        name: 'Long Combination Vehicles (LCV) - Turnpike Doubles',
        category: 'powerunit',
      },
      {
        id: 'LOGGING',
        name: 'Logging Trucks',
        category: 'powerunit',
      },
      {
        id: 'LOGOFFH',
        name: 'Logging Trucks - Off-Highway',
        category: 'powerunit',
      },
      {
        id: 'LWBTRCT',
        name: 'Long Wheelbase Truck Tractors Exceeding 6.2 m up to 7.25 m',
        category: 'powerunit',
      },
      {
        id: 'MUNFITR',
        name: 'Municipal Fire Trucks',
        category: 'powerunit',
      },
      {
        id: 'OGBEDTK',
        name: 'Oil and Gas - Bed Trucks',
        category: 'powerunit',
      },
      {
        id: 'OGOILSW',
        name: 'Oil and Gas - Oilfield Sows',
        category: 'powerunit',
      },
      {
        id: 'OGSERVC',
        name: 'Oil and Gas - Service Rigs',
        category: 'powerunit',
      },
      {
        id: 'OGSRRAH',
        name: 'Oil and Gas - Service Rigs and Rathole Augers Only Equipped with Heavy Front Projected Crane (must exceed 14,000 kg tare weight)',
        category: 'powerunit',
      },
      {
        id: 'PICKRTT',
        name: 'Picker Truck Tractors',
        category: 'powerunit',
      },
      {
        id: 'PLOWBLD',
        name: 'Trucks Equipped with Front or Underbody Plow Blades',
        category: 'powerunit',
      },
      {
        id: 'PUTAXIS',
        name: 'Taxis',
        category: 'powerunit',
      },
      {
        id: 'REGTRCK',
        name: 'Trucks',
        category: 'powerunit',
      },
      {
        id: 'SCRAPER',
        name: 'Scrapers',
        category: 'powerunit',
      },
      {
        id: 'SPAUTHV',
        name: 'Specially Authorized Vehicles',
        category: 'powerunit',
      },
      {
        id: 'STINGER',
        name: 'Truck Tractors - Stinger Steered',
        category: 'powerunit',
      },
      {
        id: 'TOWVEHC',
        name: 'Tow Vehicles',
        category: 'powerunit',
      },
      {
        id: 'TRKTRAC',
        name: 'Truck Tractors',
        category: 'powerunit',
      },
    ],
    trailerTypes: [
      {
        id: 'BOOSTER',
        name: 'Boosters',
        category: 'accessory',
        ignoreForSizeDimensions: true,
      },
      {
        id: 'DBTRBTR',
        name: 'Tandem/Tridem Drive B-Train (Super B-Train)',
        category: 'trailer',
      },
      {
        id: 'DOLLIES',
        name: 'Dollies',
        category: 'trailer',
      },
      {
        id: 'EXPANDO',
        name: 'Expando Semi-Trailers',
        category: 'trailer',
      },
      {
        id: 'FEBGHSE',
        name: 'Fixed Equipment - Portable Asphalt Baghouses',
        category: 'trailer',
      },
      {
        id: 'FECVYER',
        name: 'Fixed Equipment - Conveyors',
        category: 'trailer',
      },
      {
        id: 'FEDRMMX',
        name: 'Fixed Equipment - Counter Flow Asphalt Drum Mixers',
        category: 'trailer',
      },
      {
        id: 'FEPNYTR',
        name: 'Fixed Equipment - Pony Trailers',
        category: 'trailer',
      },
      {
        id: 'FESEMTR',
        name: 'Fixed Equipment - Semi-Trailers',
        category: 'trailer',
      },
      {
        id: 'FEWHELR',
        name: 'Fixed Equipment - Wheeler Semi-Trailers',
        category: 'wheeler',
      },
      {
        id: 'FLOATTR',
        name: 'Float Trailers',
        category: 'wheeler',
      },
      {
        id: 'FULLLTL',
        name: 'Full Trailers',
        category: 'trailer',
      },
      {
        id: 'HIBOEXP',
        name: 'Semi-Trailers - Hiboys/Expandos',
        category: 'trailer',
      },
      {
        id: 'HIBOFLT',
        name: 'Semi-Trailers - Hiboys/Flat Decks',
        category: 'trailer',
      },
      {
        id: 'JEEPSRG',
        name: 'Jeeps',
        category: 'accessory',
        ignoreForSizeDimensions: true,
      },
      {
        id: 'LOGDGLG',
        name: 'Legacy Logging Trailer Combinations - Tandem Pole Trailers, Dogloggers',
        category: 'trailer',
      },
      {
        id: 'LOGFULL',
        name: 'Logging Trailers - Full Trailers, Tri Axle, Quad Axle',
        category: 'trailer',
      },
      {
        id: 'LOGNTAC',
        name: 'Legacy Logging Trailer Combinations - Non-TAC B-Trains',
        category: 'trailer',
      },
      {
        id: 'LOGOWBK',
        name: 'Logging Trailers - Overwidth Bunks',
        category: 'trailer',
      },
      {
        id: 'LOGSMEM',
        name: 'Logging Semi-Trailer - Empty, 3.2 m Bunks',
        category: 'trailer',
      },
      {
        id: 'LOGTNDM',
        name: 'Legacy Logging Trailer Combinations - Single Axle Jeeps, Tandem Axle Pole Trailers, Dogloggers',
        category: 'trailer',
      },
      {
        id: 'LOGTRIX',
        name: 'Legacy Logging Trailer Combinations - Single Axle Jeeps, Tri Axle Trailers',
        category: 'trailer',
      },
      {
        id: 'MHMBSHG',
        name: 'Manufactured Homes, Modular Buildings, Structures and Houseboats (> 5.0 m OAW) with Attached Axles',
        category: 'trailer',
      },
      {
        id: 'MHMBSHL',
        name: 'Manufactured Homes, Modular Buildings, Structures and Houseboats (<= 5.0 m OAW) with Attached Axles',
        category: 'trailer',
      },
      {
        id: 'ODTRLEX',
        name: 'Overdimensional Trailers and Semi-Trailers (For Export)',
        category: 'trailer',
      },
      {
        id: 'OGOSFDT',
        name: 'Oil and Gas - Oversize Oilfield Flat Deck Semi-Trailers',
        category: 'trailer',
      },
      {
        id: 'PLATFRM',
        name: 'Platform Trailers',
        category: 'trailer',
      },
      {
        id: 'PMHWAAX',
        name: 'Park Model Homes with Attached Axles',
        category: 'trailer',
      },
      {
        id: 'POLETRL',
        name: 'Pole Trailers',
        category: 'trailer',
      },
      {
        id: 'PONYTRL',
        name: 'Pony Trailers',
        category: 'trailer',
      },
      {
        id: 'REDIMIX',
        name: 'Ready Mix Concrete Pump Semi-Trailers',
        category: 'trailer',
      },
      {
        id: 'SEMITRL',
        name: 'Semi-Trailers',
        category: 'trailer',
      },
      {
        id: 'STACTRN',
        name: 'Semi-Trailers - A-Trains and C-Trains',
        category: 'trailer',
      },
      {
        id: 'STBTRAN',
        name: 'Semi-Trailers - B-Trains',
        category: 'trailer',
      },
      {
        id: 'STCHIPS',
        name: 'Semi-Trailers - Walled B-Trains (Chip Trucks)',
        category: 'trailer',
      },
      {
        id: 'STCRANE',
        name: 'Semi-Trailers with Crane',
        category: 'trailer',
      },
      {
        id: 'STINGAT',
        name: 'Stinger Steered Automobile Transporters',
        category: 'trailer',
      },
      {
        id: 'STLOGNG',
        name: 'Semi-Trailers - Logging',
        category: 'trailer',
      },
      {
        id: 'STNTSHC',
        name: 'Semi-Trailers - Non-Tac Short Chassis',
        category: 'trailer',
      },
      {
        id: 'STREEFR',
        name: 'Semi-Trailers - Insulated Vans with Reefer/Refrigeration Units',
        category: 'trailer',
      },
      {
        id: 'STROPRT',
        name: 'Steering Trailers - Manned',
        category: 'trailer',
      },
      {
        id: 'STRSELF',
        name: 'Steering Trailers - Self/Remote',
        category: 'trailer',
      },
      {
        id: 'STSDBDK',
        name: 'Semi-Trailers - Single Drop, Double Drop, Step Decks, Lowbed, Expandos, etc.',
        category: 'trailer',
      },
      {
        id: 'STSTEER',
        name: 'Semi-Trailers - Steering Trailers',
        category: 'trailer',
      },
      {
        id: 'STSTNGR',
        name: 'Semi-Trailers - Stinger Steered Automobile Transporters',
        category: 'trailer',
      },
      {
        id: 'STWDTAN',
        name: 'Semi-Trailers - Spread Tandems',
        category: 'trailer',
      },
      {
        id: 'STWHELR',
        name: 'Semi-Trailers - Wheelers',
        category: 'trailer',
      },
      {
        id: 'STWIDWH',
        name: 'Semi-Trailers - Wide Wheelers',
        category: 'trailer',
      },
      {
        id: 'NONEXXX',
        name: 'No trailer',
        category: 'pseudo',
      },
    ],
  },
  commodities: [
    {
      id: 'WODWIDB',
      name: 'Wood on wide bunks',
    },
    {
      id: 'LEGALLO',
      name: 'Legal loads',
    },
    {
      id: 'GRADERS',
      name: 'Grader',
    },
    {
      id: 'HUSBAND',
      name: 'Implements of husbandry',
    },
    {
      id: 'OILFILD',
      name: 'Oil field equipment',
    },
    {
      id: 'ROKTRUK',
      name: 'Rock truck',
    },
    {
      id: 'TIRESXX',
      name: 'Tires',
    },
    {
      id: 'SRVCRIG',
      name: 'Service rig',
    },
    {
      id: 'BUNCHER',
      name: 'Buncher',
    },
    {
      id: 'CONVEYR',
      name: 'Conveyor',
    },
    {
      id: 'SKIDUNT',
      name: 'Oil field skid unit',
    },
    {
      id: 'EMPTYXX',
      name: 'Empty',
      powerUnits: [
        {
          type: 'TRKTRAC',
          canFollow: [],
        },
        {
          type: 'PICKRTT',
          canFollow: [],
        },
      ],
      trailers: [
        {
          type: 'JEEPSRG',
          canFollow: ['TRKTRAC', 'PICKRTT', 'JEEPSRG'],
        },
        {
          type: 'BOOSTER',
          canFollow: [
            'OGOSFDT',
            'PLATFRM',
            'HIBOEXP',
            'STWHELR',
            'STWIDWH',
            'STCRANE',
            'HIBOFLT',
            'STSDBDK',
            'BOOSTER',
          ],
        },
        {
          type: 'LOGOWBK',
          canFollow: ['TRKTRAC'],
          sizeDimensions: [
            {
              width: 3.2,
              length: 23,
            },
          ],
        },
        {
          type: 'OGOSFDT',
          canFollow: ['PICKRTT', 'JEEPSRG'],
          sizeDimensions: [
            {
              width: 3.2,
              height: 4.3,
              length: 23,
            },
          ],
        },
        {
          type: 'PLATFRM',
          canFollow: ['TRKTRAC', 'PICKRTT', 'JEEPSRG'],
          canSelfIssue: false,
          sizeDimensions: [
            {
              width: 3.2,
              height: 4.88,
              length: 27.5,
              regions: [
                {
                  region: 'PCE',
                  height: 5.33,
                },
              ],
            },
          ],
        },
        {
          type: 'HIBOEXP',
          canFollow: ['TRKTRAC', 'PICKRTT', 'JEEPSRG'],
          sizeDimensions: [
            {
              height: 4.4,
              length: 25,
              regions: [
                {
                  region: 'PCE',
                  height: 5.33,
                  length: 27.5,
                },
              ],
              modifiers: [
                {
                  position: 'first',
                  type: 'PICKRTT',
                },
              ],
            },
            {
              height: 4.4,
              length: 31,
              regions: [
                {
                  region: 'PCE',
                  height: 5.33,
                },
              ],
              modifiers: [
                {
                  position: 'first',
                  type: 'TRKTRAC',
                },
              ],
            },
          ],
        },
        {
          type: 'STWHELR',
          canFollow: ['TRKTRAC', 'PICKRTT', 'JEEPSRG'],
          canSelfIssue: false,
          sizeDimensions: [
            {
              width: 3.2,
              height: 4.88,
              length: 27.5,
              regions: [
                {
                  region: 'PCE',
                  height: 5.33,
                },
              ],
            },
          ],
        },
        {
          type: 'STWIDWH',
          canFollow: ['TRKTRAC', 'PICKRTT', 'JEEPSRG'],
          canSelfIssue: false,
          sizeDimensions: [
            {
              width: 3.2,
              height: 4.88,
              length: 27.5,
              regions: [
                {
                  region: 'PCE',
                  height: 5.33,
                },
              ],
            },
          ],
        },
        {
          type: 'STCRANE',
          canFollow: ['TRKTRAC', 'PICKRTT', 'JEEPSRG'],
          sizeDimensions: [
            {
              width: 3.2,
              height: 4.88,
              length: 27.5,
              regions: [
                {
                  region: 'PCE',
                  height: 5.33,
                },
              ],
            },
          ],
        },
        {
          type: 'HIBOFLT',
          canFollow: ['TRKTRAC', 'JEEPSRG'],
          sizeDimensions: [
            {
              height: 4.4,
              length: 27.5,
              regions: [
                {
                  region: 'PCE',
                  height: 5.33,
                },
              ],
            },
          ],
        },
        {
          type: 'STSDBDK',
          canFollow: ['TRKTRAC', 'JEEPSRG'],
          sizeDimensions: [
            {
              width: 3.2,
              height: 4.4,
              length: 31,
              regions: [
                {
                  region: 'PCE',
                  height: 5.33,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'GENERAL',
      name: 'General commodities',
    },
    {
      id: 'CULVERT',
      name: 'Culverts',
    },
    {
      id: 'RAMPSXX',
      name: 'Ramps',
    },
    {
      id: 'REBARXX',
      name: 'Rebar',
    },
    {
      id: 'RESTEEL',
      name: 'Reinforcing steel',
    },
    {
      id: 'STSTEEL',
      name: 'Structural steel',
    },
    {
      id: 'PIPEXXX',
      name: 'Pipe',
    },
    {
      id: 'GRBBINS',
      name: 'Garbage bins',
    },
    {
      id: 'BOATSXX',
      name: 'Boats',
    },
    {
      id: 'BOOMSTK',
      name: 'Boomsticks',
    },
    {
      id: 'CONTANR',
      name: 'Containers',
    },
    {
      id: 'HAYROND',
      name: 'Hay bales round',
    },
    {
      id: 'HAYLREC',
      name: 'Hay bales large rectangular',
    },
    {
      id: 'HAYBALE',
      name: 'Hay bales',
    },
    {
      id: 'HAYSREC',
      name: 'Hay bales small rectangular',
    },
    {
      id: 'BUILDNG',
      name: 'House or building',
    },
    {
      id: 'LONGLOG',
      name: 'Long logs',
    },
    {
      id: 'PILINGS',
      name: 'Piling',
    },
    {
      id: 'POLESXX',
      name: 'Poles',
    },
    {
      id: 'RUGHLUM',
      name: 'Rough cut lumber',
    },
    {
      id: 'VENEERX',
      name: 'Veneer',
    },
    {
      id: 'MODULAR',
      name: 'Modular building',
    },
    {
      id: 'MOBHOME',
      name: 'Mobile home manufactured',
    },
    {
      id: 'PARKTRL',
      name: 'Park model trailers',
    },
    {
      id: 'AIRCRFT',
      name: 'Aircraft',
    },
    {
      id: 'BACKHOE',
      name: 'Backhoes',
    },
    {
      id: 'BRIDGES',
      name: 'Bridges',
    },
    {
      id: 'BRGBEAM',
      name: 'Bridge beams',
      powerUnits: [
        {
          type: 'TRKTRAC',
          canFollow: [],
        },
      ],
      trailers: [
        {
          type: 'JEEPSRG',
          canFollow: ['TRKTRAC', 'JEEPSRG'],
        },
        {
          type: 'BOOSTER',
          canFollow: ['POLETRL', 'BOOSTER'],
        },
        {
          type: 'POLETRL',
          canFollow: ['TRKTRAC', 'JEEPSRG'],
        },
      ],
    },
    {
      id: 'BARGESX',
      name: 'Barges',
    },
    {
      id: 'BLADESX',
      name: 'Blades',
    },
    {
      id: 'BUCKETS',
      name: 'Buckets',
    },
    {
      id: 'CATCRLR',
      name: 'Cat or crawler',
    },
    {
      id: 'COALTRK',
      name: 'Coal truck',
    },
    {
      id: 'CMPRSOR',
      name: 'Compressor',
    },
    {
      id: 'CRANESX',
      name: 'Cranes',
    },
    {
      id: 'CRAWLER',
      name: 'Crawler',
    },
    {
      id: 'CRUSHER',
      name: 'Crusher parts',
    },
    {
      id: 'EXCVATR',
      name: 'Excavator',
    },
    {
      id: 'FORKLFT',
      name: 'Fork lifts',
    },
    {
      id: 'GENRTOR',
      name: 'Generator',
    },
    {
      id: 'LOADERX',
      name: 'Loader',
    },
    {
      id: 'LOGGING',
      name: 'Logging machinery',
    },
    {
      id: 'LOGLODR',
      name: 'Log loader',
    },
    {
      id: 'MINEMAC',
      name: 'Mine machinery',
    },
    {
      id: 'MILLMAC',
      name: 'Mill machinery',
    },
    {
      id: 'NONREDU',
      name: 'Non reducible loads',
    },
    {
      id: 'OILDRRG',
      name: 'Oil drill rig',
    },
    {
      id: 'OREBOXS',
      name: 'Ore boxes',
    },
    {
      id: 'PLSTEEL',
      name: 'Plate steel',
    },
    {
      id: 'STBEAMS',
      name: 'Steel beams',
    },
    {
      id: 'SHOVELS',
      name: 'Shovels',
    },
    {
      id: 'SKIDDER',
      name: 'Skidder',
    },
    {
      id: 'TRUSSES',
      name: 'Trusses',
    },
    {
      id: 'TANKSXX',
      name: 'Tanks',
    },
    {
      id: 'TRNSFRM',
      name: 'Transformer',
    },
    {
      id: 'TWRTUBE',
      name: 'Tower tube',
    },
    {
      id: 'VESSELS',
      name: 'Vessels',
    },
    {
      id: 'LMBEAMS',
      name: 'Laminated beams',
    },
    {
      id: 'YARDERX',
      name: 'Yarder',
    },
    {
      id: 'SKDSTAK',
      name: 'Skid stack',
    },
    {
      id: 'OTHERVE',
      name: 'Other vehicle',
    },
    {
      id: 'SCRAPER',
      name: 'Scrapers',
    },
    {
      id: 'BMCRANE',
      name: 'Booms (cranes)',
    },
    {
      id: 'GENVEHC',
      name: 'General - vehicle and loads',
    },
    {
      id: 'GENMOHO',
      name: 'General - mobile homes',
    },
    {
      id: 'AUTOCRR',
      name: 'Auto carrier, campers and boats (stinger steered)',
      powerUnits: [
        {
          type: 'STINGER',
          canFollow: [],
        },
      ],
      trailers: [
        {
          type: 'STSTNGR',
          canFollow: ['STINGER'],
          sizeDimensions: [
            {
              frontProjection: 1,
              rearProjection: 1.2,
              width: 2.6,
              height: 4.4,
              length: 25,
              regions: [
                {
                  region: 'LMN',
                  height: 4.3,
                },
                {
                  region: 'KTN',
                  height: 4.3,
                },
                {
                  region: 'PCE',
                  height: 4.88,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'BMPOLES',
      name: 'Boomsticks and poles',
    },
    {
      id: 'HAYRNPR',
      name: 'Haybales (round) Peace River only',
    },
    {
      id: 'BUSPONY',
      name: 'Inter-city bus with pony trailer',
    },
    {
      id: 'TOWTRCK',
      name: 'Tow trucks and disabled vehicles',
    },
    {
      id: 'BRSHCUT',
      name: 'Brushcutters (Peace only)',
      powerUnits: [
        {
          type: 'TRKTRAC',
          canFollow: [],
        },
        {
          type: 'REGTRCK',
          canFollow: [],
        },
      ],
      trailers: [
        {
          type: 'JEEPSRG',
          canFollow: ['TRKTRAC', 'JEEPSRG'],
        },
        {
          type: 'BOOSTER',
          canFollow: ['STSDBDK', 'BOOSTER'],
        },
        {
          type: 'SEMITRL',
          canFollow: ['TRKTRAC'],
          sizeDimensions: [
            {
              length: 23,
              regions: [
                {
                  region: 'PCE',
                  width: 4.57,
                  height: 5.33,
                },
              ],
            },
          ],
        },
        {
          type: 'STSDBDK',
          canFollow: ['TRKTRAC', 'JEEPSRG'],
          sizeDimensions: [
            {
              length: 23,
              regions: [
                {
                  region: 'PCE',
                  width: 4.57,
                  height: 5.33,
                },
              ],
            },
          ],
        },
        {
          type: 'FULLLTL',
          canFollow: ['REGTRCK'],
          sizeDimensions: [
            {
              frontProjection: 1,
              rearProjection: 1,
              length: 23,
              regions: [
                {
                  region: 'PCE',
                  width: 4.57,
                  height: 5.33,
                },
              ],
            },
          ],
        },
        {
          type: 'NONEXXX',
          canFollow: ['REGTRCK'],
          sizeDimensions: [
            {
              frontProjection: 1,
              rearProjection: 1,
              length: 12.5,
              regions: [
                {
                  region: 'PCE',
                  width: 4.57,
                  height: 5.33,
                },
              ],
            },
          ],
        },
        {
          type: 'PONYTRL',
          canFollow: ['REGTRCK'],
          sizeDimensions: [
            {
              frontProjection: 1,
              rearProjection: 1,
              length: 23,
              regions: [
                {
                  region: 'PCE',
                  width: 4.57,
                  height: 5.33,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'FIXEDEQ',
      name: 'Fixed equipment',
    },
  ],
  globalSizeDefaults: {
    frontProjection: 3,
    rearProjection: 6.5,
    width: 2.6,
    height: 4.15,
    length: 31,
  },
};
