import * as fs from 'fs';
import { parse } from 'csv-parse';
import { completePolicyConfig } from '../_test/policy-config/complete-in-progress.sample';
import { Policy } from '../policy-engine';
import { getIdFromName } from '../helper/lists.helper';
import { SizeDimension, TrailerSize } from '../types';

type DimensionEntry = {
  commodity: string;
  powerUnit: string;
  trailer: TrailerSize;
};

function csvRowToObject(row: Array<string>, pol: Policy): DimensionEntry | null {
  const commodityId = getIdFromName(pol.policyDefinition.commodities, row[1]);
  const puId = getIdFromName(pol.policyDefinition.vehicleTypes.powerUnitTypes, row[2].trim());
  const trId = getIdFromName(pol.policyDefinition.vehicleTypes.trailerTypes, row[4].trim());
  let entryObject: DimensionEntry | null = null;
  if (commodityId && puId && trId) {
    entryObject = {
      commodity: commodityId,
      powerUnit: puId,
      trailer: {
        type: trId,
        allowJeep: row[5] == 'X',
        allowBooster: row[6] == 'X',
        canSelfIssue: row[0] != 'X',
      }
    }

    let sizeDimension: SizeDimension = {regions: []};

    const fp = parseFloat(row[19]);
    const rp = parseFloat(row[20]);
    if(!isNaN(fp)) {
      sizeDimension.frontProjection = fp;
    }
    if (!isNaN(rp)) {
      sizeDimension.rearProjection = rp;
    }

    const regionIds: Array<string> = ['LMN', 'KTN', 'PCE', 'BCD'];
    // Populate the 4 region dimensions
    for (let i = 0; i < 4; i++) {
      const w = parseFloat(row[7 + (i * 3)]);
      const h = parseFloat(row[8 + (i * 3)]);
      const l = parseFloat(row[9 + (i * 3)]);
      if (!isNaN(w)) sizeDimensions?[0].regions[i].width = w;
      if (!isNaN(h)) entryObject.regions[i].height = h;
      if (!isNaN(l)) entryObject.regions[i].length = l;
    }

    return entryObject;
  } else {
    console.log(`No entry in policy config for commodity '${row[1]}' and/or power unit '${row[2]}' and/or trailer '${row[4]}'`);
    return null;
  }
}

const policy = new Policy(completePolicyConfig);
policy.policyDefinition.commodities.forEach((c) => {
  // Remove each size property from the commodity, will
  // be replaced wholesale with the new size. If the configuration
  // is not present in the new input, it should be deleted.
  if (c.size) delete c.size;
});

function processCsvRow(row: any) {
  const dimensionEntry = csvRowToObject(row, policy);
  if (dimensionEntry) {
    const commodity = policy.getCommodityDefinition(dimensionEntry.commodity);
    if (commodity) {
      // Update the list of power units
      if (!commodity.size) {
        commodity.size = { powerUnits: [] };
      }

      // Get or create power unit entry
      let powerUnit = commodity.size.powerUnits?.find((pu) => pu.type == dimensionEntry.powerUnit);
      if (!powerUnit) {
        // We don't have this power unit yet, create it
        powerUnit = {
          type: dimensionEntry.powerUnit,
          trailers: [],
        };
        commodity.size.powerUnits?.push(powerUnit);
      }

      let trailer = powerUnit.trailers.find((tr) => tr.type == dimensionEntry.trailer);
      if (!trailer) {
        // Create the trailer in configuration
        trailer = {
          type: dimensionEntry.trailer,
          allowBooster: dimensionEntry.allowBooster,
          allowJeep: dimensionEntry.allowJeep,
          sizeDimensions: [
            {
              regions: [],
            }
          ]
        };
        if (typeof dimensionEntry.fp !== 'undefined') {
          trailer.sizeDimensions[0].frontProjection
        }
        powerUnit.trailers.push(trailer);
      } else {
        console.log(`*** Duplicate trailer '${trailer.type}' in input for power unit '${powerUnit.type}'`);
      }
    }
  }
}


fs.createReadStream('./os-dimensions-simplified.csv')
  .pipe(parse({ delimiter: ',', from_line: 1 }))
  .on('data', function (row) {
    processCsvRow(row);
  }).on('end', function () {
    console.log(JSON.stringify(policy.policyDefinition, null, '   '));
  });
