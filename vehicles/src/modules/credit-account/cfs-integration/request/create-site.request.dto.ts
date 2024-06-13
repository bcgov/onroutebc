export interface CreateSiteRequestDto {
  customer_site_id: 'orbc-default';
  site_name: 'DEFAULT SITE';
  primary_bill_to: 'Y' | 'N';
  address_line_1: string;
  address_line_2: string;
  city: string;
  postal_code: string;
  province: string;
  country: string;
  customer_profile_class: 'CAS_IND_DEFAULT';
}
