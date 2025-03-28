import { Tab, Tabs } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import "./TabsList.scss";
import { TabComponentProps } from "./types/TabComponentProps";

const TabProps = (index: number) => {
  return {
    id: `layout-tab-${index}`,
    "aria-controls": `layout-tabpanel-${index}`,
  };
};

export const TabsList = ({
  value,
  handleChange,
  componentList,
}: {
  value: number;
  handleChange: (event: React.SyntheticEvent, newValue: number) => void;
  componentList: TabComponentProps[];
}) => {
  return (
    <Tabs
      className="tabs-list"
      value={value}
      onChange={handleChange}
      variant="scrollable"
      scrollButtons="auto"
      aria-label="scrollable profile tabs"
      slots={{
        StartScrollButtonIcon: () => (
          <FontAwesomeIcon icon={faAngleLeft} className="tabs-list__button" />
        ),
        EndScrollButtonIcon: () => (
          <FontAwesomeIcon icon={faAngleRight} className="tabs-list__button" />
        ),
      }}
    >
      {componentList.map(
        (
          {
            label,
            // TODO remove this if we no longer need tab counters
            // count
          },
          index,
        ) => {
          return (
            <Tab
              key={label}
              className="tabs-list__tab"
              label={
                <div className="tab">
                  <div className="tab__label">{label}</div>
                  {
                    // TODO remove this if we no longer need tab counters
                    /* {count ? <Chip className="tab__count" label={count} /> : null} */
                  }
                </div>
              }
              {...TabProps(index)}
            />
          );
        },
      )}
    </Tabs>
  );
};
