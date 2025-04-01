import { useContext, useState } from "react";
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
  SEARCH_BY_FILTERS,
  SearchByFilter,
  SearchEntity,
  SearchFields,
} from "../../../../features/idir/search/types/types";
import { useFeatureFlagsQuery } from "../../../hooks/hooks";
import OnRouteBCContext from "../../../authentication/OnRouteBCContext";

const SEARCH_BY_PERMIT_OPTIONS = [
  { label: "Permit Number", value: "permitNumber" },
  { label: "Plate Number", value: "plate" },
  { label: "VIN (last 6 digits)", value: "vin" },
];

const SEARCH_BY_COMPANY_OPTIONS = [
  { label: "Company Name", value: "companyName" },
  { label: "Client Number", value: "clientNumber" },
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

export const SearchFilter = ({
  closeFilter,
}: {
  /**
   * Callback function to close the search filter.
   */
  closeFilter: () => void;
}) => {
  const { clearCompanyContext } = useContext(OnRouteBCContext);
  const [searchParams] = useSearchParams();
  const { data: featureFlags } = useFeatureFlagsQuery();
  const navigate = useNavigate();
  const searchEntity = getDefaultSearchEntity(searchParams.get("searchEntity"));
  const [searchByOptions, setSearchByOptions] = useState(
    getSearchByOptions(searchEntity),
  );
  const searchBy = getDefaultSearchBy(
    searchEntity,
    searchParams.get("searchByFilter"),
  );
  const searchString = getDefaultRequiredVal(
    "",
    searchParams.get("searchString"),
  );
  const defaultSearchFilter = {
    searchEntity,
    searchByFilter: searchBy,
    searchString,
  } as SearchFields;

  const formMethods = useForm<SearchFields>({
    defaultValues: defaultSearchFilter,
    reValidateMode: "onBlur",
  });

  const { handleSubmit, setValue, control, watch } = formMethods;

  const searchByFilter = watch("searchByFilter");

  const handleSearchEntityChange = (searchEntity: string) => {
    setValue("searchEntity", searchEntity as SearchEntity);
    const updatedSearchByOptions = getSearchByOptions(searchEntity);
    setSearchByOptions(updatedSearchByOptions);
    setValue(
      "searchByFilter",
      updatedSearchByOptions[0].value as SearchByFilter,
    );
    setValue("searchString", "");
  };

  const handleSearchByChange = (event: SelectChangeEvent) => {
    const searchBy = event.target.value;
    setValue("searchByFilter", searchBy as SearchByFilter);
    setValue("searchString", "");
  };

  const handleSearchValueChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const searchString = event.target.value;
    setValue("searchString", searchString);
  };

  const handleSearchValueKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSubmit(onSubmit)();
    }
  };

  const onSubmit = (data: FieldValues) => {
    const searchFields = Object.entries(data)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");

    if (data?.searchString?.trim()?.length < 1) return;

    clearCompanyContext?.();
    closeFilter();

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
                  {featureFlags?.["APPLICATION-SEARCH"] === "ENABLED" && (
                    <FormControlLabel
                      label="Application"
                      value="applications"
                      control={<Radio key="find-by-application" />}
                    />
                  )}
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
                name="searchString"
                render={({ field: { value } }) => (
                  <OutlinedInput
                    className="search-by__value"
                    value={value}
                    onChange={handleSearchValueChange}
                    onKeyDown={handleSearchValueKeyDown}
                    inputProps={{
                      maxLength:
                        searchByFilter === SEARCH_BY_FILTERS.VIN ? 6 : 100,
                    }}
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
