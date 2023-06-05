import { Commodities } from "../types/application";

export const TROS_PERMIT_DURATIONS = [
  { value: 30, label: "30 Days" },
  { value: 60, label: "60 Days" },
  { value: 90, label: "90 Days" },
  { value: 120, label: "120 Days" },
  { value: 150, label: "150 Days" },
  { value: 180, label: "180 Days" },
  { value: 210, label: "210 Days" },
  { value: 240, label: "240 Days" },
  { value: 270, label: "270 Days" },
  { value: 300, label: "300 Days" },
  { value: 330, label: "330 Days" },
  { value: 365, label: "1 Year" },
];

export const TROS_INELIGIBLE_POWERUNITS = [
  {
    typeCode: "OGSERVC",
    type: "Oil and Gas - Service Rigs",
    description:
      "Oil and Gas - Service Rigs are fixed equipment oilfield service trucks and includes rathole augers only equiped with heavy front projected crane (must exceed 14,000 kg tare weight).",
  },
  {
    typeCode: "SCRAPER",
    type: "Scrapers",
    description:
      "A Scraper is a vehicle that is designed and used primarily for grading of highways, earth moving and other construction work on highways and that is not designed or used primarily for the transportation of persons or property, and that is only incidentally operated or moved over a highway.",
  },
  {
    typeCode: "BUSCRUM",
    type: "Buses/Crummies",
    description:
      "A motor vehicle used to transport persons, when such transportation is not undertaken for compensation or gain.",
  },
  {
    typeCode: "FARMVEH",
    type: "Farm Vehicles",
    description:
      "A Farm Vehicle is a commercial vehicle owned and operated by a farmer, rancher or market gardener, the use of which is confined to purposes connected with his farm, ranch or market garden, including use for pleasure and is not used in connection with any other business in which the owner may be engaged.",
  },
  {
    typeCode: "CRAFTAT",
    type: "Cranes, Rubber-Tired Loaders, Firetrucks - All Terrain",
    description:
      "Industrial vehicles not designed to transport load on highways.",
  },
  {
    typeCode: "CRAFTMB",
    type: "Cranes, Rubber-Tired Loaders, Firetrucks - Mobile",
    description:
      "Industrial vehicles not designed to transport load on highways.",
  },
];

export const TROS_INELIGIBLE_TRAILERS = [
  {
    typeCode: "STSTEER",
    type: "Semi-Trailers - Steering Trailers",
    description:
      "See Commercial Transport Procedures Manual chapter 5.3 for details.",
  },
  {
    typeCode: "STWDTAN",
    type: "Semi-Trailers - Widespread Tandems",
    description: "",
  },
  {
    typeCode: "STACTRN",
    type: "Semi-Trailers - A-Trains and C-Trains",
    description:
      "A-Train means a combination of vehicles composed of a truck tractor, a semi-trailer and either, (a) an A dolly and a semi-trailer, or (b) a full trailer.    C-Train means a combination of vehicles composed of a truck tractor and a semi-trailer, followed by another semi-trailer attached to the first semi-trailer by the means of a C dolly or C converter dolly.",
  },
  {
    typeCode: "XXXXXXX",
    type: "None",
    description:
      "Select \"None\" if no trailer is required and only the power unit is being permitted.",
  },
  {
    typeCode: "STROPRT", 
    type: "Steering Trailers - Manned", 
    description: "Treated as a semi-trailer axle group and a booster in the Heavy Haul Quick Reference Chart, but with a requirement that the number of axles in the frst axle group cannot exceed the number of axles in the second axle group"
  },
  {
    typeCode: "STRSELF",
    type: "Steering Trailers - Self/Remote",
    description: "Treated as a semi-trailer axle group and a booster in the Heavy Haul Quick Reference Chart, but with a requirement that the number of axles in the first axle group cannot exceed the number of axles in the second axle group."
  },
  {
    typeCode: "DBTRBTR",
    type: "Tandem/Tridem Drive B-Train (Super B-Train)",
    description:
      "B-trains for wood chip residual.",
  },
];

export const TROS_COMMODITIES: Commodities[] = [
  {
    description: "General Permit Conditions",
    condition: "CVSE-1000",
    conditionLink: "https://www.th.gov.bc.ca/forms/getForm.aspx?formId=1251",
    checked: true,
    disabled: true,
  },
  {
    description: "Permit Scope and Limitation",
    condition: "CVSE-1070",
    conditionLink: "https://www.th.gov.bc.ca/forms/getForm.aspx?formId=1261",
    checked: true,
    disabled: true,
  },
  {
    description: "Supplement for Structures",
    condition: "CVSE-1000S",
    conditionLink: "https://www.th.gov.bc.ca/forms/getForm.aspx?formId=1255",
    checked: false,
  },
  {
    description: "Log Permit Conditions",
    condition: "CVSE-1000L",
    conditionLink: "https://www.th.gov.bc.ca/forms/getForm.aspx?formId=1250",
    checked: false,
  },
  {
    description: "Routes - Woods Chips & Residual",
    condition: "CVSE-1012",
    conditionLink: "https://www.th.gov.bc.ca/forms/getForm.aspx?formId=1259",
    checked: false,
  },
  {
    description: "Restricted Routes for Hauling Wood on Wide Bunks",
    condition: "CVSE-1013",
    conditionLink: "https://www.th.gov.bc.ca/forms/getForm.aspx?formId=1254",
    checked: false,
  },
  {
    description: "Hay",
    condition: "HAY (hay bales)",
    conditionLink:
      "https://www.cvse.ca/ctpm/com_circulars/2012/120803_comp_cc_0912_changes_hay_bales.pdf",
    checked: false,
  },
  {
    description: "Stinger Steered Transport",
    condition: "SST (Stinger Steered Transporters)",
    conditionLink:
      "https://www.cvse.ca/CTPM/Com_Circulars/2017/171227-comp-cc_08-2107-Stinger-Steered-Car-Carrier.pdf",
    checked: false,
  },
];
