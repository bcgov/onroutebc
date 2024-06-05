export interface GovCommonServicesToken {
  access_token: string;
  aud: string;
  iss: string;
  expires_in: number;
  refresh_expires_in: number;
  token_type?: string;
  'not-before-policy': number;
  scope: string;
  expires_at?: number;
}
