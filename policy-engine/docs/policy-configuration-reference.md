# Policy Configuration Reference

## Configuration File Structure
Policy rules are defined in the policy configuration JSON object. Rules include checks for validating permit applications against policy, as well as definitions of all permit types, commodity types, vehicle types, vehicle combinations, and permittable dimensions (weight, size, allowable distances, etc.)

The JSON configuration structure is described by TypeScript types, starting with types/PolicyDefinition. The reference below goes into more detail about what each of the properties is intended to express.

### Current configuration properties in use
The below properties (link for more details) are used by the current version of the policy engine.

* [geographicRegions](#geographicRegions)
* [permitTypes](#permitTypes)
* [commonRules](#commonRules)
* [vehicleTypes](#vehicleTypes)
* [commodities](#commodities)

### Configuration properties for future use
The below properties (link for more details) are for __potential__ future use of the policy engine, and are listed in this documentation for completeness but should not be relied on yet.

* [version](#version)
* [globalWeightDefaults](#globalWeightDefaults)
* [globalSizeDefaults](#globalSizeDefaults)
* [vehicleCategories](#vehicleCategories)
* [rangeMatrices](#rangeMatrices)

## Current Configuration Properties

### geographicRegions
The geographicRegions property defines all of the distinct regions in the province which may have unique policy rules. For example, a vehicle travelling through the Peace region may have different permittable size dimensions than a vehcicle travelling through Lower Mainland.

Geographic regions are __not__ used when validating permits which do not require routing (e.g. term oversize permits).

The spatial geometry of the region itself is not stored in the policy configuration; rather, the regions travelled are returned along with the generated route from the external route planner API. The route planner maintains the link between roads and geographic regions which the policy configuration relies on.

When applying for a permit which requires a route (such as a single trip oversize) the permit applicant will enter their start and destination locations. The external route planner will generate a route appropriate for the vehicle, and will return that route along with the list of all geographic regions the route crosses.

The structure of the geographicRegions is as follows:

```js
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
  ]
```

> [!NOTE]
> The IDs assigned to the geographic regions are arbitrary, they need only be unique. When onRouteBC integrates with the route planner, the geographic region IDs may need to be modified to align with the IDs as returned by the route planner API. Alternately, a separate `key` property may be added for this purpose in future.

### permitTypes
The permitTypes property defines the basic rules and properties of all the known permit types. The basic structure is:

```js
  permitTypes: [
    {
      id: 'TROS',
      name: 'Term Oversize',
      routingRequired: false,
      weightDimensionRequired: false,
      sizeDimensionRequired: false,
      commodityRequired: false,
      allowedVehicles: [
        'EXPANDO',
        'FEBGHSE',
        'TRKTRAC',
      ],
      rules: [
        // ...see rules section...
      ],
      costRules: [
        //...see cost rules section...
      ],
    }
```
Properties of the permit type define whether it requires a driving route, weights, size, and commodity. The example above does not require any of these. A complex permit such as single trip oversize overweight would require all four.

The `allowedVehicles` property is required for permit types that are for a single vehicle as opposed to for a vehicle combination (truck and trailers). For permits requiring a vehicle combination such as single trip oversize, the `allowedVehicles` property is not used, instead using configuration inside the commodity property, described below.

The `rules` property defines policy rules for the permit type that will be checked during permit validation. There will be many rules for a single permit type, expressing business policy such as 'one may not apply for a permit with a start date in the past', 'the vehicle type being permitted must be one of the allowed vehicles for the permit type', 'a vehicle identification number must be 6 alphanumeric characters', and others. Rules are expressed using the syntax defined by [JSON Rules Engine](https://github.com/cachecontrol/json-rules-engine). See the separate section on [rules](#rules) in this document.

`costRules` are a special type of rule that define how much a permit costs based on the permit itself. Costs can take into account any property of the permit application such as duration, travel distance, start date, vehicle type, and others. See the separate section on [costRules](#costRules) in this document to understand how they differ from standard [JSON Rules Engine](https://github.com/cachecontrol/json-rules-engine) rules.

### commonRules
`commonRules` are a collection of standard rules which apply to all permit types. Certain rules such as the requirement to supply a company name for the permit and the requirement to supply a license plate for the permitted vehicle can be configured in this central location. All rules in the `commonRules` array will be validated against any permit in the validation step.

The basic structure is straightforward, and uses the same rule definition format as the rules defined as part of the permit type.
```js
  commonRules: [
    // ...see rules section...
  ]
```

### vehicleTypes
The `vehicleTypes` property defines all of the known vehicle types, both power units and trailers. The basic structure is:

```js
  vehicleTypes: {
    powerUnitTypes: [
      {
        id: 'BUSCRUM',
        name: 'Buses/Crummies',
        category: 'powerunit',
      },
      {
        id: 'BUSTRLR',
        name: 'Inter-City Bus (Pulling Pony Trailer)',
        category: 'powerunit',
      }
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
    ],
  ]
```
The example above defines 2 types of power unit and 2 types of trailer that the system knows about. The full configuration will contain all known vehicle types and will be much larger.

The ID for a vehicle type must be unique in the configuration; that is, a power unit and trailer may not share the same ID.

> [!NOTE]
> Power unit and trailer types both have a `category` property which is not currently used by the policy engine but will be used for overweight permits when they are developed (different weight allowances when a booster follows a specific category of trailer, for example).

### commodities
The `commodities` property defines all of the known permittable commodities. In addition to the ID and common name of the commodity, this property defines the allowable vehicle combinations that are allowed to transport the commodity, along with the allowable size and weight of the vehicles.