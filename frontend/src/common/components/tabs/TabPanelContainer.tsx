interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  className?: string;
}

export const TabPanelContainer = (props: TabPanelProps) => {
  const { children, value, index, className } = props;

  const baseContainerClassName = "tabpanel-container";
  const containerClassName = className ?
    `${baseContainerClassName} ${className}` : baseContainerClassName;
  
  return (
    <div
      className={containerClassName}
      role="tabpanel"
      hidden={value !== index}
      id={`layout-tabpanel-${index}`}
      aria-labelledby={`layout-tab-${index}`}
    >
      {value === index && children}
    </div>
  );
};
