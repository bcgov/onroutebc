import "./List.scss";
import { CSVOptions } from "./CSVOptions";
import { Search } from "./Search";
import { Filter } from "./Filter";
import { Trash } from "./Trash";

export const OptionsBar = () => {
  return (
    <div className="search-filter-bar-container">
      <Search />
      <Trash />
      <Filter />
      <CSVOptions />
    </div>
  );
};
