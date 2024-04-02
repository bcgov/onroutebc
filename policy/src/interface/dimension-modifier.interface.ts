import { RelativePosition } from "../enum/relative-position.enum";

interface DimensionModifier {
  position: RelativePosition;
  type?: string;
  category?: string;
  axles?: number;
  minInterAxleSpacing?: number;
  maxInterAxleSpacing?: number;
}

export default DimensionModifier;