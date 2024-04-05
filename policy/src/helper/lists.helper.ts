import IdentifiedObject from '../interface/identified-object.interface';

/**
 * Extracts a map containing just the ID and name of each of the supplied
 * identified objects.
 * @param objects List of identified objects to extract id and name from.
 * @returns Map of object ID to object name.
 */
export function extractIdentifiedObjects(
  objects: Array<IdentifiedObject>,
): Map<string, string> {
  const objectMap: Map<string, string> = new Map<string, string>();
  objects.forEach((o) => objectMap.set(o.id, o.name));
  return objectMap;
}
