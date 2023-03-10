/**
 * Account creation source: 1 is Account imported from TPS, 2 is Account
 * created by PPC staff, 3 is Account created online using BCeID).
 */
export enum AccountSource {
  TpsAccount = '1',
  PPCStaff = '2',
  BCeID = '3',
}
