import { Nullable } from '../../../../common/types/common';

export interface CreatePartyResponseDto {
  party_number: string;
  business_number: Nullable<string>;
  customer_name: string;
  links: { rel: string; href: string }[];
}
