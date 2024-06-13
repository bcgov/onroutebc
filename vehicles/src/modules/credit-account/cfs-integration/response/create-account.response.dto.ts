export interface CreateAccountResponseDto {
  account_number: string;
  party_number: string;
  account_description: string;
  customer_profile_class: 'CAS_CORP_DEFAULT';
  links: { rel: string; href: string }[];
}
