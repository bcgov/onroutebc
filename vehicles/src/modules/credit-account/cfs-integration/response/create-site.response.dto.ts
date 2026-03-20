import { Nullable } from '../../../../common/types/common';

export interface CreateSiteResponseDto {
  site_number: string;
  party_number: string;
  account_number: string;
  customer_site_id: string;
  site_name: string;
  primary_bill_to: Nullable<'Y' | 'N'>;
  address_line_1: string;
  address_line_2: Nullable<string>;
  address_line_3: Nullable<string>;
  city: string;
  postal_code: string;
  province: Nullable<string>;
  state: Nullable<string>;
  country: string;
  customer_profile_class: 'CAS_IND_DEFAULT';
  receipt_method: null;
  provider: 'Transportation and Infrastructure';
  links: { rel: string; href: string }[];
}
