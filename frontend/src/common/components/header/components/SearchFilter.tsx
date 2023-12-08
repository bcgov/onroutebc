import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  RadioGroup,
  FormControlLabel,
  Radio,
  MenuItem,
  Select,
  SelectChangeEvent,
  Button,
  OutlinedInput,
} from "@mui/material";

import {
  Controller,
  FieldValues,
  FormProvider,
  useForm,
} from "react-hook-form";

import "./SearchFilter.scss";
import { CustomSelectDisplayProps } from "../../../types/formElements";
import { getDefaultRequiredVal } from "../../../helpers/util";
import { IDIR_ROUTES } from "../../../../routes/constants";
import { Nullable } from "../../../types/common";
import {
  SearchByFilter,
  SearchEntity,
  SearchFields,
} from "../../../../features/idir/search/types/types";

const SEARCH_BY_PERMIT_OPTIONS = [
  { label: "Permit Number", value: "permitNumber" },
  { label: "Plate Number", value: "plate" },
];

const SEARCH_BY_COMPANY_OPTIONS = [
  { label: "Company Name", value: "companyName" },
  { label: "onRouteBC Client Number", value: "onRouteBCClientNumber" },
];

const SEARCH_BY_APPLICATION_OPTIONS = [
  { label: "Application Number", value: "applicationNumber" },
];

const getDefaultSearchEntity = (searchEntity?: Nullable<string>) => {
  switch (searchEntity) {
    case "companies":
      return "companies";
    case "applications":
      return "applications";
    case "permits":
    default:
      return "permits";
  }
};

const getSearchByOptions = (searchEntity?: Nullable<string>) => {
  switch (searchEntity) {
    case "companies":
      return SEARCH_BY_COMPANY_OPTIONS;
    case "applications":
      return SEARCH_BY_APPLICATION_OPTIONS;
    case "permits":
    default:
      return SEARCH_BY_PERMIT_OPTIONS;
  }
};

const getDefaultSearchBy = (
  searchEntity?: Nullable<string>,
  searchBy?: Nullable<string>,
) => {
  const defaultSearchEntity = getDefaultSearchEntity(searchEntity);
  const searchByOptions = getSearchByOptions(defaultSearchEntity).map(
    (option) => option.value,
  );
  return getDefaultRequiredVal(
    searchByOptions[0],
    searchByOptions.find((option) => option === searchBy),
  );
};

export const SearchFilter = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchEntity = getDefaultSearchEntity(searchParams.get("searchEntity"));
  const [searchByOptions, setSearchByOptions] = useState(
    getSearchByOptions(searchEntity),
  );
  const searchBy = getDefaultSearchBy(
    searchEntity,
    searchParams.get("searchByFilter"),
  );
  const searchValue = getDefaultRequiredVal(
    "",
    searchParams.get("searchValue"),
  );
  const defaultSearchFilter = {
    searchEntity,
    searchByFilter: searchBy,
    searchValue,
  } as SearchFields;

  const formMethods = useForm<SearchFields>({
    defaultValues: defaultSearchFilter,
    reValidateMode: "onBlur",
  });

  const { handleSubmit, setValue, control } = formMethods;

  const handleSearchEntityChange = (searchEntity: string) => {
    setValue("searchEntity", searchEntity as SearchEntity);
    const updatedSearchByOptions = getSearchByOptions(searchEntity);
    setSearchByOptions(updatedSearchByOptions);
    setValue(
      "searchByFilter",
      updatedSearchByOptions[0].value as SearchByFilter,
    );
  };

  const handleSearchByChange = (event: SelectChangeEvent) => {
    const searchBy = event.target.value;
    setValue("searchByFilter", searchBy as SearchByFilter);
  };

  const handleSearchValueChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const searchValue = event.target.value;
    setValue("searchValue", searchValue);
  };

  const onSubmit = (data: FieldValues) => {
    const searchFields = Object.entries(data)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
    
    navigate(`${IDIR_ROUTES.SEARCH_RESULTS}?${searchFields}`);
  };

  return (
    <FormProvider {...formMethods}>
      <div className="search-filter">
        <div className="filter">
          <div className="filter__option filter__option--find">
            <p className="option-label">Find</p>
            <Controller
              control={control}
              name="searchEntity"
              render={({ field: { value } }) => (
                <RadioGroup
                  className="find-by"
                  defaultValue={value}
                  value={value}
                  onChange={(e) => handleSearchEntityChange(e.target.value)}
                >
                  <FormControlLabel
                    label="Permit"
                    value="permits"
                    control={<Radio key="find-by-permit" />}
                  />
                  <FormControlLabel
                    label="Company"
                    value="companies"
                    control={<Radio key="find-by-company" />}
                  />
                  <FormControlLabel
                    label="Application"
                    value="applications"
                    control={<Radio key="find-by-application" />}
                  />
                </RadioGroup>
              )}
            />
          </div>
          <div className="filter__option filter__option--search">
            <p className="option-label">Search By</p>
            <div className="search-by">
              <Controller
                control={control}
                name="searchByFilter"
                render={({ field: { value } }) => (
                  <Select
                    className="search-by__select"
                    defaultValue={value}
                    value={value}
                    onChange={handleSearchByChange}
                    SelectDisplayProps={
                      {
                        "data-testid": `select-search-by`,
                      } as CustomSelectDisplayProps
                    }
                  >
                    {searchByOptions.map((option) => (
                      <MenuItem
                        key={option.value}
                        value={option.value}
                        data-testid="search-by-menu-item"
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />

              <Controller
                control={control}
                name="searchValue"
                render={({ field: { value } }) => (
                  <OutlinedInput
                    className="search-by__value"
                    value={value}
                    onChange={handleSearchValueChange}
                  />
                )}
              />

              <Button
                className="search-by__search"
                variant="contained"
                color="primary"
                onClick={handleSubmit(onSubmit)}
              >
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>
    </FormProvider>
  );
};
