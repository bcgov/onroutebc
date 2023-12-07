/**
 * Region of account: B is British Columbia, E is Extra-provincial (out of
 * province, out of country), and R is Government Agency, Military, or other
 * special case (generally no-cost permits).
 */
export enum S3uploadStatus {
  Pending = 'PENDING',
  Processing = 'PROCESSING',
  Processed = 'PROCESSED',
  Error = 'ERROR',
}
