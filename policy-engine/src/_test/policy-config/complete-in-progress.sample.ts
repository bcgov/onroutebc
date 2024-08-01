import { PolicyDefinition } from '../../types/policy-definition';

export const completePolicyConfig: PolicyDefinition = {
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
  rangeMatrices: [
    {
      id: 'annualFeeCV',
      name: 'Annual licensing fee for commercial vehicle',
      matrix: [
        { min: 0, max: 500, value: 42 },
        { min: 501, max: 1000, value: 49 },
        { min: 1001, max: 1500, value: 60 },
        { min: 1501, max: 2000, value: 74 },
        { min: 2001, max: 2500, value: 85 },
        { min: 2501, max: 3000, value: 97 },
        { min: 3001, max: 3500, value: 108 },
        { min: 3501, max: 4000, value: 127 },
        { min: 4001, max: 4500, value: 147 },
        { min: 4501, max: 5000, value: 173 },
        { min: 5001, max: 5500, value: 193 },
        { min: 5501, max: 6000, value: 213 },
        { min: 6001, max: 6500, value: 230 },
        { min: 6501, max: 7000, value: 250 },
        { min: 7001, max: 7500, value: 266 },
        { min: 7501, max: 8000, value: 292 },
        { min: 8001, max: 8500, value: 320 },
        { min: 8501, max: 9000, value: 347 },
        { min: 9001, max: 9500, value: 376 },
        { min: 9501, max: 10000, value: 395 },
        { min: 10001, max: 10500, value: 416 },
        { min: 10501, max: 11000, value: 437 },
        { min: 11001, max: 11500, value: 450 },
        { min: 11501, max: 12000, value: 469 },
        { min: 12001, max: 12500, value: 488 },
        { min: 12501, max: 13000, value: 502 },
        { min: 13001, max: 13500, value: 526 },
        { min: 13501, max: 14000, value: 553 },
        { min: 14001, max: 14500, value: 580 },
        { min: 14501, max: 15000, value: 607 },
        { min: 15001, max: 15500, value: 638 },
        { min: 15501, max: 16000, value: 680 },
        { min: 16001, max: 16500, value: 721 },
        { min: 16501, max: 17000, value: 761 },
        { min: 17001, max: 17500, value: 806 },
        { min: 17501, max: 18000, value: 837 },
        { min: 18001, max: 18500, value: 861 },
        { min: 18501, max: 19000, value: 890 },
        { min: 19001, max: 19500, value: 917 },
        { min: 19501, max: 20000, value: 944 },
        { min: 20001, max: 20500, value: 977 },
        { min: 20501, max: 21000, value: 1003 },
        { min: 21001, max: 21500, value: 1030 },
        { min: 21501, max: 22000, value: 1057 },
        { min: 22001, max: 22500, value: 1084 },
        { min: 22501, max: 23000, value: 1111 },
        { min: 23001, max: 23500, value: 1140 },
        { min: 23501, max: 24000, value: 1170 },
        { min: 24001, max: 24500, value: 1199 },
        { min: 24501, max: 25000, value: 1239 },
        { min: 25001, max: 25500, value: 1285 },
        { min: 25501, max: 26000, value: 1326 },
        { min: 26001, max: 26500, value: 1367 },
        { min: 26501, max: 27000, value: 1395 },
        { min: 27001, max: 27500, value: 1424 },
        { min: 27501, max: 28000, value: 1450 },
        { min: 28001, max: 28500, value: 1479 },
        { min: 28501, max: 29000, value: 1505 },
        { min: 29001, max: 29500, value: 1534 },
        { min: 29501, max: 30000, value: 1565 },
        { min: 30001, max: 31000, value: 1591 },
        { min: 31001, max: 32000, value: 1644 },
        { min: 32001, max: 33000, value: 1696 },
        { min: 33001, max: 34000, value: 1751 },
        { min: 34001, max: 35000, value: 1805 },
        { min: 35001, max: 36000, value: 1890 },
        { min: 36001, max: 37000, value: 2018 },
        { min: 37001, max: 38000, value: 2088 },
        { min: 38001, max: 39000, value: 2159 },
        { min: 39001, max: 40000, value: 2229 },
        { min: 40001, max: 41000, value: 2300 },
        { min: 41001, max: 42000, value: 2373 },
        { min: 42001, max: 43000, value: 2445 },
        { min: 43001, max: 44000, value: 2514 },
        { min: 44001, max: 45000, value: 2585 },
        { min: 45001, max: 46000, value: 2690 },
        { min: 46001, max: 47000, value: 2799 },
        { min: 47001, max: 48000, value: 2871 },
        { min: 48001, max: 49000, value: 2940 },
        { min: 49001, max: 50000, value: 3012 },
        { min: 50001, max: 51000, value: 3061 },
        { min: 51001, max: 52000, value: 3127 },
        { min: 52001, max: 53000, value: 3192 },
        { min: 53001, max: 54000, value: 3257 },
        { min: 54001, max: 55000, value: 3322 },
        { min: 55001, max: 56000, value: 3387 },
        { min: 56001, max: 57000, value: 3452 },
        { min: 57001, max: 58000, value: 3516 },
        { min: 58001, max: 59000, value: 3581 },
        { min: 59001, max: 60000, value: 3647 },
        { min: 60001, max: 61000, value: 3710 },
        { min: 61001, max: 62000, value: 3775 },
        { min: 62001, max: 63000, value: 3840 },
        { min: 63001, max: 63500, value: 3905 },
      ],
    },
    {
      id: 'annualFeePassenger',
      name: 'Annual licensing fee for commercial passenger vehicle',
      matrix: [
        { min: 0, max: 500, value: 40 },
        { min: 501, max: 1000, value: 47 },
        { min: 1001, max: 1500, value: 57 },
        { min: 1501, max: 2000, value: 70 },
        { min: 2001, max: 2500, value: 81 },
        { min: 2501, max: 3000, value: 92 },
        { min: 3001, max: 3500, value: 103 },
        { min: 3501, max: 4000, value: 121 },
        { min: 4001, max: 4500, value: 140 },
        { min: 4501, max: 5000, value: 165 },
        { min: 5001, max: 5500, value: 184 },
        { min: 5501, max: 6000, value: 203 },
        { min: 6001, max: 6500, value: 219 },
        { min: 6501, max: 7000, value: 238 },
        { min: 7001, max: 7500, value: 253 },
        { min: 7501, max: 8000, value: 278 },
        { min: 8001, max: 8500, value: 305 },
        { min: 8501, max: 9000, value: 330 },
        { min: 9001, max: 9500, value: 358 },
        { min: 9501, max: 10000, value: 376 },
        { min: 10001, max: 10500, value: 396 },
        { min: 10501, max: 11000, value: 416 },
        { min: 11001, max: 11500, value: 429 },
        { min: 11501, max: 12000, value: 447 },
        { min: 12001, max: 12500, value: 465 },
        { min: 12501, max: 13000, value: 478 },
        { min: 13001, max: 13500, value: 501 },
        { min: 13501, max: 14000, value: 527 },
        { min: 14001, max: 14500, value: 552 },
        { min: 14501, max: 15000, value: 578 },
        { min: 15001, max: 15500, value: 608 },
        { min: 15501, max: 16000, value: 648 },
        { min: 16001, max: 16500, value: 687 },
        { min: 16501, max: 17000, value: 725 },
        { min: 17001, max: 17500, value: 768 },
        { min: 17501, max: 18000, value: 797 },
        { min: 18001, max: 18500, value: 820 },
        { min: 18501, max: 19000, value: 848 },
        { min: 19001, max: 19500, value: 873 },
        { min: 19501, max: 20000, value: 899 },
        { min: 20001, max: 20500, value: 930 },
        { min: 20501, max: 21000, value: 955 },
        { min: 21001, max: 21500, value: 981 },
        { min: 21501, max: 22000, value: 1007 },
        { min: 22001, max: 22500, value: 1032 },
        { min: 22501, max: 23000, value: 1058 },
        { min: 23001, max: 23500, value: 1086 },
        { min: 23501, max: 24000, value: 1114 },
        { min: 24001, max: 24500, value: 1142 },
        { min: 24501, max: 25000, value: 1180 },
        { min: 25001, max: 25500, value: 1224 },
        { min: 25501, max: 26000, value: 1263 },
        { min: 26001, max: 26500, value: 1302 },
        { min: 26501, max: 27000, value: 1329 },
        { min: 27001, max: 27500, value: 1356 },
        { min: 27501, max: 28000, value: 1381 },
        { min: 28001, max: 28500, value: 1409 },
        { min: 28501, max: 29000, value: 1433 },
        { min: 29001, max: 29500, value: 1461 },
        { min: 29501, max: 30000, value: 1490 },
        { min: 30001, max: 31000, value: 1516 },
        { min: 31001, max: 32000, value: 1569 },
        { min: 32001, max: 33000, value: 1621 },
        { min: 33001, max: 34000, value: 1676 },
        { min: 34001, max: 35000, value: 1730 },
        { min: 35001, max: 36000, value: 1815 },
        { min: 36001, max: 37000, value: 1943 },
        { min: 37001, max: 38000, value: 2013 },
        { min: 38001, max: 39000, value: 2084 },
        { min: 39001, max: 40000, value: 2154 },
        { min: 40001, max: 41000, value: 2225 },
        { min: 41001, max: 42000, value: 2298 },
        { min: 42001, max: 43000, value: 2370 },
        { min: 43001, max: 44000, value: 2439 },
        { min: 44001, max: 45000, value: 2510 },
        { min: 45001, max: 46000, value: 2615 },
        { min: 46001, max: 47000, value: 2724 },
        { min: 47001, max: 48000, value: 2796 },
        { min: 48001, max: 49000, value: 2865 },
        { min: 49001, max: 50000, value: 2937 },
        { min: 50001, max: 51000, value: 2986 },
        { min: 51001, max: 52000, value: 3052 },
        { min: 52001, max: 53000, value: 3117 },
        { min: 53001, max: 54000, value: 3182 },
        { min: 54001, max: 55000, value: 3247 },
        { min: 55001, max: 56000, value: 3312 },
        { min: 56001, max: 57000, value: 3377 },
        { min: 57001, max: 58000, value: 3441 },
        { min: 58001, max: 59000, value: 3506 },
        { min: 59001, max: 60000, value: 3572 },
        { min: 60001, max: 61000, value: 3635 },
        { min: 61001, max: 62000, value: 3700 },
        { min: 62001, max: 63000, value: 3765 },
        { min: 63001, max: 63500, value: 3830 },
      ],
    },
    {
      id: 'annualFeeIndustrial',
      name: 'Annual licensing fee for an industrial machine',
      matrix: [
        { min: 0, max: 2000, value: 45 },
        { min: 2001, max: 5000, value: 69 },
        { min: 5001, max: 7000, value: 110 },
        { min: 7001, max: 9000, value: 164 },
        { min: 9001, max: 11000, value: 216 },
        { min: 11001, value: 260 },
      ],
    },
    {
      id: 'annualFeeFarm',
      name: 'Annual licensing fee for farm vehicle',
      matrix: [
        { min: 0, max: 500, value: 30 },
        { min: 501, max: 1000, value: 40 },
        { min: 1001, max: 1500, value: 47 },
        { min: 1501, max: 2000, value: 55 },
        { min: 2001, max: 2500, value: 77 },
        { min: 2501, max: 3000, value: 101 },
        { min: 3001, max: 3500, value: 142 },
        { min: 3501, max: 4000, value: 181 },
        { min: 4001, max: 4500, value: 207 },
        { min: 4501, max: 5000, value: 243 },
        { min: 5001, max: 5500, value: 278 },
        { min: 5501, max: 6000, value: 322 },
        { min: 6001, max: 6500, value: 355 },
        { min: 6501, max: 7000, value: 396 },
        { min: 7001, max: 7500, value: 427 },
        { min: 7501, max: 8000, value: 473 },
        { min: 8001, max: 8500, value: 524 },
        { min: 8501, max: 9000, value: 558 },
        { min: 9001, max: 9500, value: 596 },
        { min: 9501, max: 10000, value: 633 },
        { min: 10001, max: 10500, value: 669 },
        { min: 10501, max: 11000, value: 711 },
        { min: 11001, max: 11500, value: 744 },
        { min: 11501, max: 12000, value: 784 },
        { min: 12001, max: 12500, value: 824 },
        { min: 12501, max: 13000, value: 863 },
        { min: 13001, max: 13500, value: 883 },
        { min: 13501, max: 14000, value: 899 },
        { min: 14001, max: 14500, value: 919 },
        { min: 14501, max: 15000, value: 940 },
        { min: 15001, max: 15500, value: 960 },
        { min: 15501, max: 16000, value: 979 },
        { min: 16001, max: 16500, value: 997 },
        { min: 16501, max: 17000, value: 1017 },
        { min: 17001, max: 17500, value: 1036 },
        { min: 17501, max: 18000, value: 1056 },
        { min: 18001, max: 18500, value: 1076 },
        { min: 18501, max: 19000, value: 1096 },
        { min: 19001, max: 19500, value: 1114 },
        { min: 19501, max: 20000, value: 1134 },
        { min: 20001, max: 20500, value: 1154 },
        { min: 20501, max: 21000, value: 1174 },
        { min: 21001, max: 21500, value: 1192 },
        { min: 21501, max: 22000, value: 1211 },
        { min: 22001, max: 22500, value: 1231 },
        { min: 22501, max: 23000, value: 1251 },
        { min: 23001, max: 23500, value: 1270 },
        { min: 23501, max: 24000, value: 1289 },
        { min: 24001, max: 24400, value: 1309 },
      ],
    },
  ],
  commonRules: [
    {
      conditions: {
        not: {
          fact: 'permitData.companyName',
          operator: 'stringMinimumLength',
          value: 1,
        },
      },
      event: {
        type: 'violation',
        params: {
          message: 'Company is required',
          code: 'field-validation-error',
          fieldReference: 'permitData.companyName',
        },
      },
    },
    {
      conditions: {
        not: {
          fact: 'permitData.contactDetails.firstName',
          operator: 'stringMinimumLength',
          value: 1,
        },
      },
      event: {
        type: 'violation',
        params: {
          message: 'Contact first name is required',
          code: 'field-validation-error',
          fieldReference: 'permitData.contactDetails.firstName',
        },
      },
    },
    {
      conditions: {
        not: {
          fact: 'permitData.contactDetails.lastName',
          operator: 'stringMinimumLength',
          value: 1,
        },
      },
      event: {
        type: 'violation',
        params: {
          message: 'Contact last name is required',
          code: 'field-validation-error',
          fieldReference: 'permitData.contactDetails.lastName',
        },
      },
    },
    {
      conditions: {
        not: {
          fact: 'permitData.contactDetails.phone1',
          operator: 'stringMinimumLength',
          value: 1,
        },
      },
      event: {
        type: 'violation',
        params: {
          message: 'Contact phone number is required',
          code: 'field-validation-error',
          fieldReference: 'permitData.contactDetails.phone1',
        },
      },
    },
    {
      conditions: {
        not: {
          fact: 'permitData.contactDetails.email',
          operator: 'stringMinimumLength',
          value: 1,
        },
      },
      event: {
        type: 'violation',
        params: {
          message: 'Company contact email is required',
          code: 'field-validation-error',
          fieldReference: 'permitData.contactDetails.email',
        },
      },
    },
    {
      conditions: {
        any: [
          {
            fact: 'permitData.startDate',
            operator: 'dateLessThan',
            value: {
              fact: 'validationDate',
            },
          },
        ],
      },
      event: {
        type: 'violation',
        params: {
          message: 'Permit start date cannot be in the past',
          code: 'field-validation-error',
          fieldReference: 'permitData.startDate',
        },
      },
    },
    {
      conditions: {
        not: {
          fact: 'permitData.vehicleDetails.vin',
          operator: 'regex',
          value: '^[a-zA-Z0-9]{6}$',
        },
      },
      event: {
        type: 'violation',
        params: {
          message:
            'Vehicle Identification Number (vin) must be 6 alphanumeric characters',
          code: 'field-validation-error',
          fieldReference: 'permitData.vehicleDetails.vin',
        },
      },
    },
    {
      conditions: {
        not: {
          fact: 'permitData.vehicleDetails.plate',
          operator: 'stringMinimumLength',
          value: 1,
        },
      },
      event: {
        type: 'violation',
        params: {
          message: 'Vehicle plate is required',
          code: 'field-validation-error',
          fieldReference: 'permitData.vehicleDetails.plate',
        },
      },
    },
    {
      conditions: {
        not: {
          fact: 'permitData.vehicleDetails.make',
          operator: 'stringMinimumLength',
          value: 1,
        },
      },
      event: {
        type: 'violation',
        params: {
          message: 'Vehicle make is required',
          code: 'field-validation-error',
          fieldReference: 'permitData.vehicleDetails.make',
        },
      },
    },
    {
      conditions: {
        not: {
          fact: 'permitData.vehicleDetails.year',
          operator: 'greaterThan',
          value: 1900,
        },
      },
      event: {
        type: 'violation',
        params: {
          message: 'Vehicle year is required',
          code: 'field-validation-error',
          fieldReference: 'permitData.vehicleDetails.year',
        },
      },
    },
    {
      conditions: {
        not: {
          fact: 'permitData.vehicleDetails.countryCode',
          operator: 'stringMinimumLength',
          value: 1,
        },
      },
      event: {
        type: 'violation',
        params: {
          message: 'Vehicle country of registration is required',
          code: 'field-validation-error',
          fieldReference: 'permitData.vehicleDetails.countryCode',
        },
      },
    },
  ],
  permitTypes: [
    {
      id: 'TROS',
      name: 'Term Oversize',
      routingRequired: false,
      weightDimensionRequired: false,
      sizeDimensionRequired: false,
      commodityRequired: false,
      allowedVehicles: [
        'BOOSTER',
        'DOLLIES',
        'EXPANDO',
        'FEBGHSE',
        'FECVYER',
        'FEDRMMX',
        'FEPNYTR',
        'FESEMTR',
        'FEWHELR',
        'FLOATTR',
        'FULLLTL',
        'HIBOEXP',
        'HIBOFLT',
        'JEEPSRG',
        'LOGDGLG',
        'LOGFULL',
        'LOGNTAC',
        'LOGOWBK',
        'LOGSMEM',
        'LOGTNDM',
        'LOGTRIX',
        'ODTRLEX',
        'OGOSFDT',
        'PLATFRM',
        'POLETRL',
        'PONYTRL',
        'REDIMIX',
        'SEMITRL',
        'STBTRAN',
        'STCHIPS',
        'STCRANE',
        'STINGAT',
        'STLOGNG',
        'STNTSHC',
        'STREEFR',
        'STSDBDK',
        'STSTNGR',
        'STWHELR',
        'STWIDWH',
        'BUSTRLR',
        'CONCRET',
        'DDCKBUS',
        'GRADERS',
        'LOGGING',
        'LOGOFFH',
        'LWBTRCT',
        'OGBEDTK',
        'OGOILSW',
        'PICKRTT',
        'PLOWBLD',
        'REGTRCK',
        'STINGER',
        'TOWVEHC',
        'TRKTRAC',
      ],
      rules: [
        {
          conditions: {
            all: [
              {
                not: {
                  fact: 'permitData.permitDuration',
                  operator: 'in',
                  value: [30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330],
                },
              },
              {
                not: {
                  fact: 'permitData.permitDuration',
                  operator: 'equal',
                  value: {
                    fact: 'daysInPermitYear',
                  },
                },
              },
            ],
          },
          event: {
            type: 'violation',
            params: {
              message: 'Duration must be in 30 day increments or a full year',
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
          fact: 'costPerMonth',
          params: {
            cost: 30,
          },
        },
      ],
    },
    {
      id: 'TROW',
      name: 'Term Overweight',
      routingRequired: false,
      weightDimensionRequired: false,
      sizeDimensionRequired: false,
      commodityRequired: false,
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
            all: [
              {
                not: {
                  fact: 'permitData.permitDuration',
                  operator: 'in',
                  value: [30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330],
                },
              },
              {
                not: {
                  fact: 'permitData.permitDuration',
                  operator: 'equal',
                  value: {
                    fact: 'daysInPermitYear',
                  },
                },
              },
            ],
          },
          event: {
            type: 'violation',
            params: {
              message: 'Duration must be in 30 day increments or a full year',
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
          fact: 'costPerMonth',
          params: {
            cost: 100,
          },
        },
      ],
    },
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
