import * as fs from 'fs';
import { parse } from 'csv-parse';
import { completePolicyConfig } from '../_test/policy-config/complete-in-progress.sample';
import { Policy } from '../policy-engine';
import { getIdFromName } from '../helper/lists.helper';
import { RegionSizeOverride, SizeDimension, TrailerSize } from '../types';

type DimensionEntry = {
  commodity: string;
  powerUnit: string;
  trailer: TrailerSize;
};

function csvRowToObject(
  row: Array<string>,
  pol: Policy,
): DimensionEntry | null {
  const commodityId = getIdFromName(pol.policyDefinition.commodities, row[1]);
  const puId = getIdFromName(
    pol.policyDefinition.vehicleTypes.powerUnitTypes,
    row[2].trim(),
  );
  const trId = getIdFromName(
    pol.policyDefinition.vehicleTypes.trailerTypes,
    row[4].trim(),
  );
  let entryObject: DimensionEntry | null = null;
  if (commodityId && puId && trId) {
    entryObject = {
      commodity: commodityId,
      powerUnit: puId,
      trailer: {
        type: trId,
        jeep: row[5] == 'X',
        booster: row[6] == 'X',
        selfIssue: row[0] != 'X',
      },
    };

    const sizeDimension: SizeDimension = {};

    const fp = parseFloat(row[19]);
    const rp = parseFloat(row[20]);
    if (!isNaN(fp)) {
      sizeDimension.fp = fp;
    }
    if (!isNaN(rp)) {
      sizeDimension.rp = rp;
    }

    // Populate the BC Default dimensions
    const bcWidth = parseFloat(row[16]);
    const bcHeight = parseFloat(row[17]);
    const bcLength = parseFloat(row[18]);
    if (!isNaN(bcWidth)) sizeDimension.w = bcWidth;
    if (!isNaN(bcHeight)) sizeDimension.h = bcHeight;
    if (!isNaN(bcLength)) sizeDimension.l = bcLength;

    const regionIds: Array<string> = ['LMN', 'KTN', 'PCE'];
    // Populate the 3 region dimensions
    for (let i = 0; i < regionIds.length; i++) {
      const w = parseFloat(row[7 + i * 3]);
      const h = parseFloat(row[8 + i * 3]);
      const l = parseFloat(row[9 + i * 3]);
      if (
        (isNaN(w) || w == sizeDimension.w) &&
        (isNaN(h) || h == sizeDimension.h) &&
        (isNaN(l) || l == sizeDimension.l)
      ) {
        // All values for this region are empty or are the
        // same as the BC default values. In this case do not
        // include the region in the configuration at all
        continue;
      }

      if (!sizeDimension.regions) {
        sizeDimension.regions = [];
      }

      const regionOverride: RegionSizeOverride = { region: regionIds[i] };
      if (!isNaN(w) && w != sizeDimension.w) regionOverride.w = w;
      if (!isNaN(h) && h != sizeDimension.h) regionOverride.h = h;
      if (!isNaN(l) && l != sizeDimension.l) regionOverride.l = l;
      sizeDimension.regions.push(regionOverride);
    }

    entryObject.trailer.sizeDimensions = [];
    entryObject.trailer.sizeDimensions.push(sizeDimension);

    return entryObject;
  } else {
    console.log(
      `No entry in policy config for commodity '${row[1]}' and/or power unit '${row[2]}' and/or trailer '${row[4]}'`,
    );
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
      let powerUnit = commodity.size.powerUnits?.find(
        (pu) => pu.type == dimensionEntry.powerUnit,
      );
      if (!powerUnit) {
        // We don't have this power unit yet, create it
        powerUnit = {
          type: dimensionEntry.powerUnit,
          trailers: [],
        };
        commodity.size.powerUnits?.push(powerUnit);
      }

      const trailer = powerUnit.trailers.find(
        (tr) => tr.type == dimensionEntry.trailer.type,
      );
      if (!trailer) {
        // Create the trailer in configuration
        powerUnit.trailers.push(dimensionEntry.trailer);
      } else {
        console.log(
          `*** Duplicate trailer '${trailer.type}' in input for power unit '${powerUnit.type}'`,
        );
      }
    }
  }
}

fs.createReadStream('./os-dimensions-simplified-nodefault.csv')
  .pipe(parse({ delimiter: ',', from_line: 1 }))
  .on('data', function (row) {
    processCsvRow(row);
  })
  .on('end', function () {
    console.log(JSON.stringify(policy.policyDefinition, null, '   '));
    //console.log(JSON.stringify(policy.policyDefinition));
  });
