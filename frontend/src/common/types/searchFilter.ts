export type FindByOption = "permit" | "company";

export type SearchByOption<T extends FindByOption> = T extends "permit" ? 
  "permit" | "plate" :
  "name";

export interface SearchFilter {
  findBy: FindByOption;
  searchBy: SearchByOption<FindByOption>;
  searchValue: string;
}
