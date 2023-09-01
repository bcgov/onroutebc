export interface VoidPermitDto {
  permitId: string;
  reason: string;
  revoke: boolean;
  email?: string;
  fax?: string;
}
