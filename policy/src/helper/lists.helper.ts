import IdentifiedObject from "../interface/identified-object.interface"

export function extractIdentifiedObjects(objects: Array<IdentifiedObject>): Map<string, string>  {
  const objectMap: Map<string, string> = new Map<string, string>();
  objects.forEach((o) => objectMap.set(o.id, o.name));
  return objectMap;
}