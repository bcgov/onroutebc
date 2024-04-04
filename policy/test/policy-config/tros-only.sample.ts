import PolicyDefinition from "../../src/interface/policy-definition.interface"

export const trosOnly: PolicyDefinition = {
  "version": "2024.03.18.001",
  "geographicRegions": [],
  "commonRules": [
    {
      "conditions": {
        "not": {
          "any": [
            {
              "fact": "permitData",
              "path": "$.companyName",
              "operator": "stringMinimumLength",
              "value": 1
            }
          ]
        }
      },
      "event": {
        "type": "violation",
        "params": {
          "message": "Company is required"
        }
      }
    },
    {
      "conditions": {
        "any": [
          {
            "fact": "permitData",
            "path": "$.startDate",
            "operator": "dateLessThan",
            "value": {
              "fact": "validation-date"
            }
          }
        ]
      },
      "event": {
        "type": "violation",
        "params": {
          "message": "Permit start date cannot be in the past"
        }
      }
    },
    {
      "conditions": {
        "not": {
          "any": [
            {
              "fact": "permitData",
              "path": "$.vehicleDetails.vin",
              "operator": "regex",
              "value": "^[a-zA-Z0-9]{6}$"
            }
          ]
        }
      },
      "event": {
        "type": "violation",
        "params": {
          "message": "Vehicle Identification Number (vin) must be 6 alphanumeric characters"
        }
      }
    }
  ],
  "permitTypes": [
    {
      "id": "TROS",
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
      "rules": [
        {
          "conditions": {
            "all": [{
              "not": {
                "any": [
                  {
                    "fact": "permitData",
                    "path": "$.permitDuration",
                    "operator": "in",
                    "value": [30,60,90,120,150,180,210,240,270,300,330]
                  }
                ]
              }
            }, {
              "not": {
                "any": [
                  {
                    "fact": "permitData",
                    "path": "$.duration",
                    "operator": "equal",
                    "value": {
                      "fact": "days-in-current-year"
                    }
                  }
                ]
              }
            }]
          },
          "event": {
            "type": "violation",
            "params": {
              "message": "Duration must be in 30 day increments or a full year"
            }
          }
        }
      ]
    }
  ],
  "globalWeightDefaults": {
    "powerUnits": [],
    "trailers": []
  },
  "globalSizeDefaults": {
    "frontProjection": 3,
    "rearProjection": 6.5,
    "width": 2.6,
    "height": 4.15,
    "length": 31
  },
  "vehicleCategories": {
    "trailerCategories": [],
    "powerUnitCategories": []
  },
  "vehicleTypes": {
    "powerUnitTypes": [],
    "trailerTypes": []
  },
  "commodities": []
}
