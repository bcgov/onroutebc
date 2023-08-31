export interface VoidPermitDto {
  permitId: string;
  reason?: string;
  revoke: boolean;
  refund: boolean;
  email?: string;
  fax?: string;
}
