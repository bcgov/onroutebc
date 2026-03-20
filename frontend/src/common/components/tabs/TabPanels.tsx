import { TabPanelContainer } from "./TabPanelContainer";
import { TabComponentProps } from "./types/TabComponentProps";

export const TabPanels = ({
  value,
  componentList,
  containerClassName,
}: {
  value: number;
  componentList: TabComponentProps[];
  containerClassName?: string;
}) => (
  <>
    {componentList.map(({ label, component }, index) => {
      return (
        <TabPanelContainer
          key={label}
          value={value}
          index={index}
          className={containerClassName}
        >
          {component}
        </TabPanelContainer>
      );
    })}
  </>
);
