interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export const TabPanelContainer = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      className="tabpanel-container"
      role="tabpanel"
      hidden={value !== index}
      id={`layout-tabpanel-${index}`}
      aria-labelledby={`layout-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
};
