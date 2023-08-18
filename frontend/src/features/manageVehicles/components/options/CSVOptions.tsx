import { OnRouteBCTableRowActions } from "../../../../common/components/table/OnRouteBCTableRowActions";
import "./Options.scss";

const options = ["Import CSV", "Export CSV"];

export const CSVOptions = () => {

  /**
   * On select handler
   * @param _selectedOption The selected option. 
   */
  const onSelectOption = (_selectedOption: string) => {
    // for eventual implementation
  }

  return (
    <div className="csv-container">
      <OnRouteBCTableRowActions
        onSelectOption={onSelectOption}
        options={options}
        disabled={true}
      />
    </div>
  );
};
