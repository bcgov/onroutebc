export const fullSample = {
  "version": "2024.03.18.001",
  "geographicRegions": [
    {
      "id": "lm",
      "name": "Lower Mainland"
    },
    {
      "id": "kootenay",
      "name": "Kootenay"
    },
    {
      "id": "peace",
      "name": "Peace"
    }
  ],
  "commonPermitDataValidations": [
    {
      "field": "company",
      "required": true
    },
    {
      "field": "startDate",
      "required": true,
      "conditions": [
        {
          "comparison": "gte",
          "value": "!today"
        }
      ]
    },
    {
      "field": "vin",
      "required": true,
      "conditions": [
        {
          "comparison": "regex",
          "value": "^[a-zA-Z0-9]{6}$"
        }
      ]
    }
  ],
  "permitTypes": [
    {
      "id": "tros",
      "name": "Term Oversize",
      "routingRequired": false,
      "weightDimensionRequired": false,
      "sizeDimensionRequired": false,
      "commodityRequired": false,
      "allowedVehicles": [
        "trucktractor",
        "truck",
        "semi",
        "platform",
        "ogoilfieldsemi"
      ],
      "dataValidations": [
        {
          "field": "permitDuration",
          "required": true,
          "conditions": [
            {
              "any": [
                {
                  "all": [
                    {
                      "comparison": "multiple",
                      "value": 30
                    },
                    {
                      "comparison": "lessThanInclusive",
                      "value": 330
                    }
                  ]
                },
                {
                  "comparison": "fullYear"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "trow",
      "name": "Term Overweight",
      "routingRequired": false,
      "weightDimensionRequired": false,
      "sizeDimensionRequired": false,
      "commodityRequired": false,
      "allowedVehicles": [
        "trucktractor",
        "truck",
        "semi",
        "platform",
        "ogoilfieldsemi"
      ]
    },
    {
      "id": "stow",
      "name": "Single Trip Overweight",
      "routingRequired": true,
      "weightDimensionRequired": true,
      "sizeDimensionRequired": false,
      "commodityRequired": true,
      "allowedVehicles": [
        "trucktractor",
        "truck",
        "semi",
        "platform",
        "ogoilfieldsemi",
        "pickertrucktractor",
        "poletrailer",
        "hiboyexpando",
        "deck"
      ],
      "allowedCommodities": [
        "bridgebeams",
        "empty",
        "fixed",
        "intermodalcontainers",
        "laminatedbeams"
      ]
    },
    {
      "id": "stos",
      "name": "Single Trip Oversize",
      "routingRequired": true,
      "weightDimensionRequired": false,
      "sizeDimensionRequired": true,
      "commodityRequired": true,
      "allowedVehicles": [
        "trucktractor",
        "truck",
        "semi",
        "platform",
        "ogoilfieldsemi",
        "poletrailer",
        "hiboyexpando"
      ],
      "allowedCommodities": [
        "bridgebeams",
        "empty",
        "fixed",
        "intermodalcontainers",
        "laminatedbeams"
      ]
    },
    {
      "id": "stws",
      "name": "Single Trip Oversize Overweight",
      "routingRequired": true,
      "weightDimensionRequired": true,
      "commodityRequired": true,
      "sizeDimensionRequired": true,
      "allowedVehicles": [
        "trucktractor",
        "truck",
        "semi",
        "platform",
        "ogoilfieldsemi",
        "poletrailer",
        "hiboyexpando"
      ],
      "allowedCommodities": [
        "bridgebeams",
        "empty",
        "fixed",
        "laminatedbeams"
      ]
    }
  ],
  "globalWeightDefaults": {
    "powerUnits": [
      {
        "axles": 11,
        "saLegal": 6000,
        "saPermittable": 9100,
        "daLegal": 9100,
        "daPermittable": 11000
      },
      {
        "axles": 12,
        "saLegal": 6000,
        "saPermittable": 9100,
        "daLegal": 17000,
        "daPermittable": 23000
      },
      {
        "axles": 13,
        "saLegal": 7300,
        "saPermittable": 9100,
        "daLegal": 24000,
        "daPermittable": 28000
      },
      {
        "axles": 22,
        "saLegal": 17000,
        "saPermittable": 17000,
        "daLegal": 17000,
        "daPermittable": 23000
      },
      {
        "axles": 23,
        "saLegal": 13600,
        "saPermittable": 15200,
        "daLegal": 24000,
        "daPermittable": 28000
      },
      {
        "axles": 33,
        "saLegal": 24000,
        "saPermittable": 24000,
        "daLegal": 24000,
        "daPermittable": 28000
      }
    ],
    "trailers": [
      {
        "axles": 1,
        "legal": 9100,
        "permittable": 11000
      },
      {
        "axles": 2,
        "legal": 17000,
        "permittable": 23000
      },
      {
        "axles": 3,
        "legal": 24000,
        "permittable": 28000
      }
    ]
  },
  "globalSizeDefaults": {
    "frontProjection": 3,
    "rearProjection": 6.5,
    "width": 2.6,
    "height": 4.15,
    "length": 31
  },
  "vehicleCategories": {
    "trailerCategories": [
      {
        "id": "semitrailer",
        "name": "Semi-Trailer",
        "defaultWeightDimensions": [
          {
            "axles": 1
          },
          {
            "axles": 2
          },
          {
            "axles": 3,
            "legal": 24000,
            "permittable": 29000
          },
          {
            "axles": 3,
            "modifier": {
              "position": "after",
              "type": "booster",
              "axles": 2
            },
            "legal": 24000,
            "permittable": 28000
          },
          {
            "axles": 3,
            "modifier": {
              "position": "after",
              "type": "booster",
              "axles": 3
            },
            "legal": 24000,
            "permittable": 28000
          }
        ]
      },
      {
        "id": "wheeler",
        "name": "Wheeler",
        "defaultWeightDimensions": [
          {
            "axles": 1
          },
          {
            "axles": 2
          },
          {
            "axles": 3,
            "legal": 24000,
            "permittable": 29000
          },
          {
            "axles": 3,
            "modifier": {
              "position": "after",
              "type": "booster",
              "axles": 2
            },
            "legal": 24000,
            "permittable": 28000
          },
          {
            "axles": 3,
            "modifier": {
              "position": "after",
              "type": "booster",
              "axles": 3
            },
            "legal": 24000,
            "permittable": 28000
          }
        ]
      }
    ],
    "powerUnitCategories": [
      {
        "id": "powerunit",
        "name": "Power Unit"
      }
    ]
  },
  "vehicleTypes": {
    "powerUnitTypes": [
      {
        "id": "trucktractor",
        "name": "Truck Tractor",
        "category": "powerunit",
        "defaultWeightDimensions": [
          {
            "axles": 11
          },
          {
            "axles": 12
          },
          {
            "axles": 13
          },
          {
            "axles": 22
          },
          {
            "axles": 23
          }
        ]
      },
      {
        "id": "pickertrucktractor",
        "name": "Picker Truck Tractor",
        "category": "powerunit",
        "defaultWeightDimensions": [
          {
            "axles": 11,
            "saLegal": 9100,
            "saPermittable": 9100,
            "daLegal": 9100,
            "daPermittable": 9100
          },
          {
            "axles": 12,
            "saLegal": 9100,
            "saPermittable": 9100,
            "daLegal": 17000,
            "daPermittable": 17000
          },
          {
            "axles": 13,
            "saLegal": 9100,
            "saPermittable": 9100,
            "daLegal": 24000,
            "daPermittable": 24000
          },
          {
            "axles": 22,
            "saLegal": 17000,
            "saPermittable": 17000,
            "daLegal": 17000,
            "daPermittable": 17000
          },
          {
            "axles": 23,
            "saLegal": 15200,
            "saPermittable": 15200,
            "daLegal": 24000,
            "daPermittable": 24000
          }
        ]
      },
      {
        "id": "truck",
        "name": "Truck",
        "category": "powerunit",
        "defaultWeightDimensions": [
          {
            "axles": 11,
            "saLegal": 9100,
            "saPermittable": 9100,
            "daLegal": 9100,
            "daPermittable": 11000
          },
          {
            "axles": 12,
            "saLegal": 9100,
            "saPermittable": 9100,
            "daLegal": 17000,
            "daPermittable": 23000
          },
          {
            "axles": 13,
            "saLegal": 9100,
            "saPermittable": 9100,
            "daLegal": 24000,
            "daPermittable": 28000
          },
          {
            "axles": 22,
            "saLegal": 17000,
            "saPermittable": 17000,
            "daLegal": 17000,
            "daPermittable": 23000
          },
          {
            "axles": 23,
            "saLegal": 13600,
            "saPermittable": 15200,
            "daLegal": 24000,
            "daPermittable": 28000
          }
        ]
      }
    ],
    "trailerTypes": [
      {
        "id": "poletrailer",
        "name": "Pole Trailer",
        "category": "semitrailer"
      },
      {
        "id": "expando",
        "name": "Expando Semi-Trailer",
        "category": "semitrailer"
      },
      {
        "id": "ogoilfieldsemi",
        "name": "Oil and Gas - Oversize Oilfield Flat Deck Semi-Trailer",
        "category": "semitrailer"
      },
      {
        "id": "platform",
        "name": "Platform Trailer",
        "category": "semitrailer"
      },
      {
        "id": "semi",
        "name": "Semi-Trailer",
        "category": "semitrailer"
      },
      {
        "id": "hiboyexpando",
        "name": "Semi-Trailer - Hiboy/Expando",
        "category": "semitrailer"
      },
      {
        "id": "hiboyflatdeck",
        "name": "Semi-Trailer - Hiboy/Flat Deck",
        "category": "semitrailer"
      },
      {
        "id": "drop",
        "name": "Semi-Trailer - Single Drop, Double Drop, Step Deck, Lowbed, Expando, etc.",
        "category": "semitrailer"
      },
      {
        "id": "steering",
        "name": "Semi-Trailer - Steering Trailer",
        "category": "semitrailer"
      },
      {
        "id": "wheeler",
        "name": "Semi-Trailer - Wheeler",
        "category": "wheeler"
      },
      {
        "id": "widewheeler",
        "name": "Semi-Trailer - Wide Wheeler",
        "category": "wheeler"
      },
      {
        "id": "semicrane",
        "name": "Semi-Trailer with Crane",
        "category": "semitrailer"
      },
      {
        "id": "widetandem",
        "name": "Semi-Trailer - Widespread Tandem",
        "category": "semitrailer",
        "defaultWeightDimensions": [
          {
            "axles": 2,
            "legal": 9100,
            "permittable": 18200
          }
        ]
      },
      {
        "id": "pony",
        "name": "Pony Trailer",
        "category": "semitrailer",
        "defaultWeightDimensions": [
          {
            "axles": 1
          },
          {
            "axles": 2,
            "legal": 17000,
            "permittable": 21000
          },
          {
            "axles": 3,
            "legal": 21000,
            "permittable": 21000
          }
        ]
      },
      {
        "id": "fixedwheeler",
        "name": "Fixed Equipment - Wheeler Semi-Trailer",
        "category": "semitrailer",
        "defaultWeightDimensions": [
          {
            "axles": 2,
            "legal": 17000,
            "permittable": 31000,
            "canSelfIssue": false
          },
          {
            "axles": 3,
            "legal": 24000,
            "permittable": 40000,
            "canSelfIssue": false
          }
        ]
      },
      {
        "id": "booster",
        "name": "Booster",
        "category": "Booster",
        "defaultWeightDimensions": [
          {
            "axles": 1
          },
          {
            "axles": 2
          },
          {
            "axles": 3
          },
          {
            "axles": 1,
            "modifier": {
              "position": "before",
              "category": "semitrailer",
              "axles": 3,
              "minInterAxleSpacing": 0,
              "maxInterAxleSpacing": 419
            },
            "legal": 9100,
            "permittable": 9100
          }
        ]
      },
      {
        "id": "jeep",
        "name": "Jeep",
        "category": "Jeep",
        "defaultWeightDimensions": [
          {
            "axles": 1
          },
          {
            "axles": 2
          },
          {
            "axles": 3
          }
        ]
      }
    ]
  },
  "commodities": [
    {
      "id": "bridgebeams",
      "name": "Bridge Beams",
      "powerUnits": [
        {
          "type": "trucktractor",
          "canFollow": []
        }
      ],
      "trailers": [
        {
          "type": "jeep",
          "canFollow": [
            "trucktractor"
          ]
        },
        {
          "type": "booster",
          "canFollow": [
            "poletrailer"
          ]
        },
        {
          "type": "poletrailer",
          "canFollow": [
            "jeep",
            "trucktractor"
          ],
          "sizeDimensions": [
            {
              "frontProjection": 3,
              "rearProjection": 6.5,
              "width": 2.6,
              "height": 4.15,
              "length": 31
            }
          ]
        }
      ]
    },
    {
      "id": "empty",
      "name": "Empty",
      "powerUnits": [
        {
          "type": "trucktractor",
          "canFollow": []
        },
        {
          "type": "pickertrucktractor",
          "canFollow": []
        },
        {
          "type": "truck",
          "canFollow": []
        }
      ],
      "trailers": [
        {
          "type": "jeep",
          "canFollow": [
            "trucktractor",
            "pickertrucktractor"
          ]
        },
        {
          "type": "booster",
          "canFollow": [
            "poletrailer",
            "expando",
            "ogoilfieldsemi",
            "semi",
            "hiboyexpando",
            "hiboyflatdeck",
            "drop",
            "steering",
            "wheeler",
            "widewheeler",
            "semicrane"
          ]
        },
        {
          "type": "poletrailer",
          "canFollow": [
            "trucktractor",
            "pickertrucktractor",
            "jeep"
          ]
        },
        {
          "type": "expando",
          "canFollow": [
            "trucktractor",
            "pickertrucktractor",
            "jeep"
          ],
          "sizeDimensions": [
            {
              "frontProjection": 3,
              "rearProjection": 6.5,
              "width": 2.6,
              "height": 4.4,
              "length": 31,
              "regions": [
                {
                  "region": "peace",
                  "height": 5.33
                }
              ],
              "modifier": {
                "position": "first",
                "type": "trucktractor"
              }
            },
            {
              "frontProjection": 3,
              "rearProjection": 6.5,
              "width": 2.6,
              "height": 4.4,
              "length": 25,
              "regions": [
                {
                  "region": "peace",
                  "height": 5.33,
                  "length": 27.5
                }
              ],
              "modifier": {
                "position": "first",
                "type": "pickertrucktractor"
              }
            }
          ]
        },
        {
          "type": "ogoilfieldsemi",
          "canFollow": [
            "trucktractor",
            "pickertrucktractor",
            "jeep"
          ]
        },
        {
          "type": "platform",
          "canFollow": [
            "trucktractor",
            "pickertrucktractor",
            "jeep"
          ]
        },
        {
          "type": "semi",
          "canFollow": [
            "trucktractor",
            "pickertrucktractor",
            "jeep"
          ]
        },
        {
          "type": "hiboyexpando",
          "canFollow": [
            "trucktractor",
            "pickertrucktractor",
            "jeep"
          ]
        },
        {
          "type": "hiboyflatdeck",
          "canFollow": [
            "trucktractor",
            "pickertrucktractor",
            "jeep"
          ]
        },
        {
          "type": "drop",
          "canFollow": [
            "trucktractor",
            "pickertrucktractor",
            "jeep"
          ]
        },
        {
          "type": "steering",
          "canFollow": [
            "trucktractor",
            "pickertrucktractor",
            "jeep"
          ]
        },
        {
          "type": "wheeler",
          "canFollow": [
            "trucktractor",
            "pickertrucktractor",
            "jeep"
          ]
        },
        {
          "type": "widewheeler",
          "canFollow": [
            "trucktractor",
            "pickertrucktractor",
            "jeep"
          ]
        },
        {
          "type": "semicrane",
          "canFollow": [
            "trucktractor",
            "pickertrucktractor",
            "jeep"
          ]
        }
      ]
    },
    {
      "id": "fixed",
      "name": "Fixed Equipment",
      "powerUnits": [
        {
          "type": "trucktractor",
          "canFollow": []
        },
        {
          "type": "truck",
          "canFollow": []
        }
      ],
      "trailers": [
        {
          "type": "jeep",
          "canFollow": [
            "trucktractor"
          ]
        },
        {
          "type": "booster",
          "canFollow": [
            "fixedcounterasphalt",
            "fixedportableasphalt",
            "fixedsemi",
            "fixedwheeler"
          ]
        },
        {
          "type": "fixedconveyor",
          "canFollow": [
            "trucktractor",
            "truck",
            "jeep"
          ]
        },
        {
          "type": "fixedcounterasphalt",
          "canFollow": [
            "trucktractor",
            "jeep"
          ]
        },
        {
          "type": "fixedportableasphalt",
          "canFollow": [
            "trucktractor",
            "jeep"
          ]
        },
        {
          "type": "fixedsemi",
          "canFollow": [
            "trucktractor",
            "jeep"
          ]
        },
        {
          "type": "fixedwheeler",
          "canFollow": [
            "trucktractor",
            "jeep"
          ]
        },
        {
          "type": "widetandem",
          "canFollow": [
            "trucktractor",
            "jeep"
          ]
        },
        {
          "type": "fixedpony",
          "canFollow": [
            "truck"
          ]
        },
        {
          "type": "pony",
          "canFollow": [
            "truck"
          ]
        }
      ]
    },
    {
      "id": "intermodalcontainers",
      "name": "Intermodal Containers without Sides",
      "powerUnits": [
        {
          "type": "trucktractor",
          "canFollow": []
        }
      ],
      "trailers": [
        {
          "type": "jeep",
          "canFollow": [
            "trucktractor"
          ]
        },
        {
          "type": "booster",
          "canFollow": [
            "drop"
          ]
        },
        {
          "type": "drop",
          "canFollow": [
            "jeep",
            "trucktractor"
          ]
        }
      ]
    },
    {
      "id": "laminatedbeams",
      "name": "Laminated Beams",
      "powerUnits": [
        {
          "type": "trucktractor",
          "canFollow": []
        }
      ],
      "trailers": []
    },
    {
      "id": "manufacturedhomes",
      "name": "Manufactured Homes, Modular Buildings, Structures and Houseboats (>5.0m OAW)"
    },
    {
      "id": "nonreducible",
      "name": "Non-Reducible Loads"
    },
    {
      "id": "none",
      "name": "None"
    },
    {
      "id": "oilfieldequipment",
      "name": "Oil Field Equipment"
    },
    {
      "id": "reducibleloads",
      "name": "Reducible Loads"
    },
    {
      "id": "scrapers",
      "name": "Scrapers on Dollies"
    },
    {
      "id": "tow",
      "name": "Tow Trucks and Disabled Vehicles"
    }
  ]
}