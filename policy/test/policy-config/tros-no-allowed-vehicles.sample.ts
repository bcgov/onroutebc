import PolicyDefinition from "../../src/interface/policy-definition.interface"

export const trosNoAllowedVehicles: PolicyDefinition = {
  "version": "2024.03.18.001",
  "geographicRegions": [],
  "commonRules": [],
  "permitTypes": [
    {
      "id": "TROS",
      "name": "Term Oversize",
      "routingRequired": false,
      "weightDimensionRequired": false,
      "sizeDimensionRequired": false,
      "commodityRequired": false,
      "allowedVehicles": [],
      "rules": [
        {
          "conditions": {
            "not": {
              "fact": "permitData",
              "path": "$.vehicleDetails.vehicleSubType",
              "operator": "in",
              "value": {
                "fact": "allowed-vehicles"
              }
            }
          },
          "event": {
            "type": "violation",
            "params": {
              "message": "Vehicle type not permittable for this permit type"
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
