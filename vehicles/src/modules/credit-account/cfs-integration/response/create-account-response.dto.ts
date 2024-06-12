export interface CreateAccountResponseDto {
  account_number: string;
  party_number: string;
  account_description: string;
  customer_profile_class: 'CAS_CORP_DEFAULT';
  links: Array<{ rel: string; href: string }>;
}
