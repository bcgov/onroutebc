import { FormControl, FormLabel, Select } from "@mui/material";
import { SELECT_FIELD_STYLE } from "../../../../themes/orbcStyles";
import { useFormContext } from "react-hook-form";

/**
 * This simple MUI select component with integration with React Hook Forms
 */
export const CustomSimpleSelectWithRegister = ({
  value,
  label,
  menuItems,
  width,
  registerOptions,
}: {
  value: string;
  label: string;
  menuItems: JSX.Element[] | undefined;
  width: string;
  registerOptions: any;
}) => {
  const {
    register,
    trigger,
    formState: { isSubmitted },
  } = useFormContext();

  return (
    <FormControl margin="normal">
      <FormLabel sx={SELECT_FIELD_STYLE.FORM_LABEL}>{label}</FormLabel>
      <Select
        value={value}
        MenuProps={SELECT_FIELD_STYLE.MENU_PROPS}
        sx={[
          SELECT_FIELD_STYLE.SELECT_FIELDSET,
          {
            width: { width },
          },
        ]}
        {...register(registerOptions.name, registerOptions.options)}
        // This onClose function fixes a bug where the Select component does not immediately
        // revalidate when selecting an option after an invalid form submission.
        // The validation needed to be triggered again manually
        onClose={async () => {
          if (isSubmitted) {
            const output = await trigger(registerOptions.name);
            if (!output) {
              trigger(registerOptions.name);
            }
          }
        }}
      >
        {menuItems}
      </Select>
    </FormControl>
  );
};
