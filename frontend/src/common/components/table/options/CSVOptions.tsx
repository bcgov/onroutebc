import { OnRouteBCTableRowActions } from "../../../../common/components/table/OnRouteBCTableRowActions";
import "./CSVOptions.scss";

const CSV_OPTION_TYPES = {
  IMPORT: "import",
  EXPORT: "export",
} as const;

type CSVOptionType = typeof CSV_OPTION_TYPES[keyof typeof CSV_OPTION_TYPES];

const options: { 
  label: string; 
  value: CSVOptionType; 
}[] = [
  {
    label: "Import CSV", 
    value: CSV_OPTION_TYPES.IMPORT,
  },
  { 
    label: "Export CSV",
    value: CSV_OPTION_TYPES.EXPORT,
  },
];

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
