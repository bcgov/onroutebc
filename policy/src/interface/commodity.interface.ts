import IdentifiedObject from './identified-object.interface';
import { PowerUnit, Trailer } from './vehicles.interface';

interface Commodity extends IdentifiedObject {
  powerUnits?: Array<PowerUnit>;
  trailers?: Array<Trailer>;
}

export default Commodity;