import IdentifiedObject from "../interface/identified-object.interface"

export const extractIdentifiedObjects = (objects: Array<IdentifiedObject>) => {
  let objectList: Array<IdentifiedObject> = [];
  if (objects) {
    objectList = objects.map((o) => {
      return { "id": o.id, "name": o.name };
    });
  }
  return objectList;
}