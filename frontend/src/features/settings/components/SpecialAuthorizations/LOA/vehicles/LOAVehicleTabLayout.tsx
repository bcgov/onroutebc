import { TabPanels } from "../../../../../../common/components/tabs/TabPanels";
import { TabsList } from "../../../../../../common/components/tabs/TabsList";
import { LOAVehicleTab } from "../../../../types/LOAVehicleTab";

export const LOAVehicleTabLayout = ({
  tabComponents,
  selectedTabIndex,
  onTabChange,
}: {
  tabComponents: {
    label: string;
    component: JSX.Element;
  }[];
  selectedTabIndex: LOAVehicleTab;
  onTabChange: (tabIndex: number) => void;
}) => {
  return (
    <div className="loa-vehicle-tab-layout">
      <TabsList
        value={selectedTabIndex}
        componentList={tabComponents}
        handleChange={(_, newTab) => onTabChange(newTab)}
      />

      <TabPanels
        value={selectedTabIndex}
        componentList={tabComponents}
      />
    </div>
  );
};
