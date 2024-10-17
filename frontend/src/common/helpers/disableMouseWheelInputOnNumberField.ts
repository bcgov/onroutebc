// Prevent mouse wheel from changing the value on fields where inputType: "number"
export const disableMouseWheelInputOnNumberField = (
  event: React.FocusEvent<HTMLInputElement>,
) => {
  event.target.addEventListener(
    "wheel",
    function (event) {
      event.preventDefault();
    },
    { passive: false },
  );
};
