import { TabPanelContainer } from "./TabPanelContainer";
import { TabComponentProps } from "./types/TabComponentProps";

export const TabPanels = ({
  value,
  componentList,
}: {
  value: number;
  componentList: TabComponentProps[];
}) => (
  <>
    {componentList.map(({ label, component }, index) => {
      return (
        <TabPanelContainer key={label} value={value} index={index}>
          {component}
        </TabPanelContainer>
      );
    })}
  </>
);
