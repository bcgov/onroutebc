import { useFormContext } from "react-hook-form";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  OutlinedInput,
} from "@mui/material";

import { AxleFrontGroup, AxleType, AxleGroup } from "../../../types/Vehicle";

interface AxleGroupFormSectionProps {
  axleGroup?: AxleGroup;
  formName: "power-unit-form" | "trailer-form";
}

/**
 * The AxleGroupFormSection subcomponent provides a form containing the fields pertaining
 * to axle groups. It is only intended to be used as a section in a bigger form component.
 * @returns A subcomponent with axle group form section fields.
 */
export const AxleGroupFormSection = ({
  axleGroup,
  formName,
}: AxleGroupFormSectionProps) => {
  const { register } = useFormContext();

  return (
    <div className={`${formName}__section`}>
      <div className={`${formName}__radio-field`}>
        <FormControl margin="normal">
          <FormLabel
            id="axle-front-group-radiogroup"
            className={`${formName}__field-label`}
          >
            Axle Front Group
          </FormLabel>

          <RadioGroup
            row
            aria-labelledby="axle-front-group-radiogroup"
            {...register("axle-front-group", {
              required: true,
            })}
            defaultValue={axleGroup?.axleFrontGroup}
          >
            <FormControlLabel
              value={AxleFrontGroup.Single}
              control={<Radio />}
              label="Single"
            />
            <FormControlLabel
              value={AxleFrontGroup.Tandem}
              control={<Radio />}
              label="Tandem"
            />
            <FormControlLabel
              value={AxleFrontGroup.Tridem}
              control={<Radio />}
              label="Tridem"
            />
          </RadioGroup>
        </FormControl>
      </div>

      <div className={`${formName}__radio-field`}>
        <FormControl margin="normal">
          <FormLabel
            id="axle-type-front-radiogroup"
            className={`${formName}__field-label`}
          >
            Axle Type Front
          </FormLabel>

          <RadioGroup
            row
            aria-labelledby="axle-type-front-radiogroup"
            {...register("axle-type-front", {
              required: true,
            })}
            defaultValue={axleGroup?.axleTypeFront}
          >
            <FormControlLabel
              value={AxleType.Steering}
              control={<Radio />}
              label="Steering"
            />
            <FormControlLabel
              value={AxleType.Drive}
              control={<Radio />}
              label="Drive"
            />
          </RadioGroup>
        </FormControl>
      </div>

      <div className={`${formName}__radio-field`}>
        <FormControl margin="normal">
          <FormLabel
            id="axle-type-rear-radiogroup"
            className={`${formName}__field-label`}
          >
            Axle Type Rear
          </FormLabel>

          <RadioGroup
            row
            aria-labelledby="axle-type-rear-radiogroup"
            {...register("axle-type-rear", {
              required: true,
            })}
            defaultValue={axleGroup?.axleTypeRear}
          >
            <FormControlLabel
              value={AxleType.Steering}
              control={<Radio />}
              label="Steering"
            />
            <FormControlLabel
              value={AxleType.Drive}
              control={<Radio />}
              label="Drive"
            />
          </RadioGroup>
        </FormControl>
      </div>

      <div className={`${formName}__field`}>
        <FormControl margin="normal">
          <FormLabel
            id="axle-group-number-label"
            className={`${formName}__field-label`}
          >
            Axle Group Number
          </FormLabel>

          <OutlinedInput
            aria-labelledby="axle-group-number-label"
            defaultValue={axleGroup?.axleGroupNumber}
          />
        </FormControl>
      </div>

      <div className={`${formName}__field`}>
        <FormControl margin="normal">
          <FormLabel
            id="axle-group-spacing-label"
            className={`${formName}__field-label`}
          >
            Axle Group Spacing
          </FormLabel>

          <OutlinedInput
            aria-labelledby="axle-group-spacing-label"
            margin="dense"
            defaultValue={axleGroup?.axleGroupSpacing}
          />
        </FormControl>
      </div>

      <div className={`${formName}__field`}>
        <FormControl margin="normal">
          <FormLabel
            id="interaxle-spread-front-label"
            className={`${formName}__field-label`}
          >
            Interaxle Spread Front (m)
          </FormLabel>

          <OutlinedInput
            aria-labelledby="interaxle-spread-front-label"
            margin="dense"
            defaultValue={axleGroup?.interaxleSpreadFront}
          />
        </FormControl>
      </div>

      <div className={`${formName}__field`}>
        <FormControl margin="normal">
          <FormLabel
            id="interaxle-spread-rear-label"
            className={`${formName}__field-label`}
          >
            Interaxle Spread Rear (m)
          </FormLabel>

          <OutlinedInput
            aria-labelledby="interaxle-spread-rear-label"
            margin="dense"
            defaultValue={axleGroup?.interaxleSpreadRear}
          />
        </FormControl>
      </div>

      <div className={`${formName}__field`}>
        <FormControl margin="normal">
          <FormLabel
            id="interaxle-spread-front-label"
            className={`${formName}__field-label`}
          >
            Number of Tires Front
          </FormLabel>

          <OutlinedInput
            aria-labelledby="interaxle-spread-front-label"
            margin="dense"
            defaultValue={axleGroup?.numberOfTiresFront}
          />
        </FormControl>
      </div>

      <div className={`${formName}__field`}>
        <FormControl margin="normal">
          <FormLabel
            id="number-of-tires-rear-label"
            className={`${formName}__field-label`}
          >
            Number of Tires Rear
          </FormLabel>

          <OutlinedInput
            aria-labelledby="number-of-tires-rear-label"
            margin="dense"
            defaultValue={axleGroup?.numberOfTiresRear}
          />
        </FormControl>
      </div>
    </div>
  );
};
