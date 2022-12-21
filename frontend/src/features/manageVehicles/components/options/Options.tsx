import "./Options.scss";
import { CSVOptions } from "./CSVOptions";
import { Search } from "./Search";
import { Filter } from "./Filter";
import { Trash } from "./Trash";

export const Options = () => {
  return (
    <div className="options-container">
      <Search />
      <Trash />
      <Filter />
      <CSVOptions />
    </div>
  );
};
