import { Nullable } from '../../../../common/types/common';

export interface CreateSiteContactResponseDto {
  contact_number: string;
  party_number: string;
  account_number: string;
  site_number: string;
  full_name: string;
  first_name: string;
  middle_name: Nullable<string>;
  last_name: string;
  phone_number: string;
  email_address: string;
  provider: 'Transportation and Infrastructure';
  links: Array<{ rel: string; href: string }>;
}
