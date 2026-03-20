import "./DashboardTabPanels.scss";
import { TabPanels } from "../tabs/TabPanels";
import { TabComponentProps } from "../tabs/types/TabComponentProps";

export const DashboardTabPanels = ({
  value,
  componentList,
}: {
  value: number;
  componentList: TabComponentProps[];
}) => {
  return (
    <TabPanels
      value={value}
      componentList={componentList}
      containerClassName="dashboard-tab-panels"
    />
  );
};
