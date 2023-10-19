import { useFormContext } from "react-hook-form";
import "./VehicleForm.scss";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import {
  AxleFrontGroup,
  AxleType,
  AxleGroup,
} from "../../../types/managevehicles";
import OutlinedInput from "@mui/material/OutlinedInput";

/**
 * The props that can be passed to the axle group form.
 */
interface AxleGroupFormProps {
  /**
   * The object containing the fields of the axle group (optional).
   * If given, it will be used to set the values of the fields.
   */
  axleGroup?: AxleGroup;
}

/**
 * The AxleGroupForm component provides a form containing the fields pertaining
 * to axle groups. It is only intended to be a subsection in a bigger component.
 * @returns A react component with axle group form fields.
 */
export const AxleGroupForm = ({ axleGroup }: AxleGroupFormProps) => {
  const { register } = useFormContext();

  const boldTextStyle = {
    fontWeight: "bold",
  };

  return (
    <div id="axle-group-form">
      <div>
        <FormControl margin="normal">
          <FormLabel id="axle-front-group-radiogroup" sx={boldTextStyle}>
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
      <div>
        <FormControl margin="normal">
          <FormLabel id="axle-type-front-radiogroup" sx={boldTextStyle}>
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
      <div>
        <FormControl margin="normal">
          <FormLabel id="axle-type-rear-radiogroup" sx={boldTextStyle}>
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
      <div>
        {/* <FormLabel>{t('vehicle.axle-group.axle-group-number')}</FormLabel> */}
        <FormControl margin="normal">
          <FormLabel id="axle-group-number-label" sx={boldTextStyle}>
            Axle Group Number
          </FormLabel>
          <OutlinedInput
            aria-labelledby="axle-group-number-label"
            defaultValue={axleGroup?.axleGroupNumber}
          />
        </FormControl>
      </div>
      <div>
        <FormControl margin="normal">
          <FormLabel id="axle-group-spacing-label" sx={boldTextStyle}>
            Axle Group Spacing
          </FormLabel>
          <OutlinedInput
            aria-labelledby="axle-group-spacing-label"
            margin="dense"
            defaultValue={axleGroup?.axleGroupSpacing}
          />
        </FormControl>
      </div>
      <div>
        <FormControl margin="normal">
          <FormLabel id="interaxle-spread-front-label" sx={boldTextStyle}>
            Interaxle Spread Front (m)
          </FormLabel>
          <OutlinedInput
            aria-labelledby="interaxle-spread-front-label"
            margin="dense"
            defaultValue={axleGroup?.interaxleSpreadFront}
          />
        </FormControl>
      </div>
      <div>
        <FormControl margin="normal">
          <FormLabel id="interaxle-spread-rear-label" sx={boldTextStyle}>
            Interaxle Spread Rear (m)
          </FormLabel>
          <OutlinedInput
            aria-labelledby="interaxle-spread-rear-label"
            margin="dense"
            defaultValue={axleGroup?.interaxleSpreadRear}
          />
        </FormControl>
      </div>
      <div>
        <FormControl margin="normal">
          <FormLabel id="interaxle-spread-front-label" sx={boldTextStyle}>
            Number of Tires Front
          </FormLabel>
          <OutlinedInput
            aria-labelledby="interaxle-spread-front-label"
            margin="dense"
            defaultValue={axleGroup?.numberOfTiresFront}
          />
        </FormControl>
      </div>
      <div>
        <FormControl margin="normal">
          <FormLabel id="number-of-tires-rear-label" sx={boldTextStyle}>
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
