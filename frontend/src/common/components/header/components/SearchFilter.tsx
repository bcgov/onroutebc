import { useState } from "react";
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

import "./SearchFilter.scss";
import { Controller, FieldValues, FormProvider, useForm } from "react-hook-form";
import { FindByOption, SearchByOption, SearchFilter as SearchFilterType } from "../../../types/searchFilter";
import { CustomSelectDisplayProps } from "../../../types/formElements";
import { useSearchParams } from "react-router-dom";
import { getDefaultRequiredVal } from "../../../helpers/util";

const SEARCH_BY_PERMIT_OPTIONS = [
  { label: "Permit Number", value: "permit" }, 
  { label: "Plate Number", value: "plate" },
];

const SEARCH_BY_COMPANY_OPTIONS = [
  { label: "Company Name", value: "company" },
];

const getDefaultFindBy = (findBy?: string | null) => {
  if (findBy === "company") {
    return "company";
  }
  return "permit";
};

const getSearchByOptions = (findBy: string | null) => {
  if (findBy === "company") {
    return SEARCH_BY_COMPANY_OPTIONS;
  }
  return SEARCH_BY_PERMIT_OPTIONS;
};

const getDefaultSearchBy = (findBy?: string | null, searchBy?: string | null) => {
  const defaultFindBy = getDefaultFindBy(findBy);
  const searchByOptions = getSearchByOptions(defaultFindBy).map(option => option.value);
  return getDefaultRequiredVal(
    searchByOptions[0],
    searchByOptions.find(option => option === searchBy)
  );
};

export const SearchFilter = () => {
  const [searchParams] = useSearchParams();
  const findBy = getDefaultFindBy(searchParams.get("findBy"));
  const [searchByOptions, setSearchByOptions] = useState(getSearchByOptions(findBy));
  const searchBy = getDefaultSearchBy(findBy, searchParams.get("searchBy"));
  const searchValue = getDefaultRequiredVal("", searchParams.get("searchValue"));
  const defaultSearchFilter = { 
    findBy,
    searchBy,
    searchValue,
  } as SearchFilterType;

  const formMethods = useForm<SearchFilterType>({
    defaultValues: defaultSearchFilter,
    reValidateMode: "onBlur",
  });
  
  const { handleSubmit, setValue, control } = formMethods;

  const handleFindByChange = (findBy: string) => {
    setValue("findBy", findBy as FindByOption);
    const updatedSearchByOptions = getSearchByOptions(findBy);
    setSearchByOptions(updatedSearchByOptions);
    setValue("searchBy", updatedSearchByOptions[0].value as SearchByOption<FindByOption>);
  };

  const handleSearchByChange = (event: SelectChangeEvent) => {
    const searchBy = event.target.value;
    setValue("searchBy", searchBy as SearchByOption<FindByOption>);
  };

  const handleSearchValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value;
    setValue("searchValue", searchValue);
  };

  const onSubmit = (data: FieldValues) => {
    console.log(data);
  };

  return (
    <FormProvider {...formMethods}>
      <div className="search-filter">
        <div className="filter">
          <div className="filter__option filter__option--find">
            <p className="option-label">Find</p>
            <Controller
              control={control}
              name="findBy"
              render={({ field: { value } }) => (
                <RadioGroup
                  className="find-by"
                  defaultValue={value}
                  value={value}
                  onChange={(e) => handleFindByChange(e.target.value)}
                >
                  <FormControlLabel
                    label="Permit"
                    value="permit"
                    control={
                      <Radio 
                        key="find-by-permit"
                      />
                    }
                  />
                  <FormControlLabel
                    label="Company"
                    value="company"
                    control={
                      <Radio 
                        key="find-by-company"
                      />
                    }
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
                name="searchBy"
                render={({ field: { value } }) => (
                  <Select
                    className="search-by__select"
                    defaultValue={value}
                    value={value}
                    onChange={handleSearchByChange}
                    SelectDisplayProps={{
                      "data-testid": `select-search-by`
                    } as CustomSelectDisplayProps}
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
