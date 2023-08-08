export type PaginatedResponse<T> = {
  items: T[];
  meta: PageMetadata;
};

export type PageMetadata = {
  currentPage: number;
  currentItemCount: number;
  itemsPerPage: number;
  totalPages?: number;
  totalItems?: number;
};

export type ReadCompanyUser = {
  firstName: string;
  lastName: string;
  phone1: string;
  phone2: string;
  fax: string;
  email: string;
  city: string;
  userGUID: string;
  userAuthGroup: "PUBLIC" | "CVCLIENT" | "ORGADMIN";
  statusCode: "ACTIVE" | "DISABLED";
  userName: string;
  phone1Extension: string;
  phone2Extension: string;
  provinceCode: string;
  countryCode: string;
};
