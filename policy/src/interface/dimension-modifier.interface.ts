import SelfIssuable from './self-issuable.interface';

interface DimensionModifier extends SelfIssuable {
  position: string;
  type?: string;
  category?: string;
  axles?: number;
  minInterAxleSpacing?: number;
  maxInterAxleSpacing?: number;
}

export default DimensionModifier;
