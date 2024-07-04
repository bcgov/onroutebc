import { IdentifiedObject } from 'onroute-policy-engine/types';

/**
 * Extracts a map containing just the ID and name of each of the supplied
 * identified objects.
 * @param objects List of identified objects to extract id and name from.
 * @param filter Optional list of IDs to constrain the map to. Only objects
 *   with an ID matching one of the elements in the filter will
 *   be returned. If no filter supplied, all objects will be returned.
 * @returns Map of object ID to object name.
 */
export function extractIdentifiedObjects(
  objects: Array<IdentifiedObject>,
  filter?: Array<string>,
): Map<string, string> {
  const objectMap: Map<string, string> = new Map<string, string>();
  objects.forEach((o) => {
    if (!filter || filter.includes(o.id)) {
      objectMap.set(o.id, o.name);
    }
  });
  return objectMap;
}
