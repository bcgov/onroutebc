import { useForm } from "react-hook-form";
import { Button } from "../../../common/components/button/Button";
import "./VehicleForm.scss";

export const VehicleForm = () => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <div className="mv-form-container">
      <form className="mv-form">
        <div>
          <label className="mv-label">Make</label>
          <input className="mv-input" {...register("make")} />
        </div>
        <div>
          <label className="mv-label">Year</label>
          <input className="mv-input" {...register("year", { required: true })} />
          {errors.year && <label className="mv-label">Year is required.</label>}
        </div>
        <div>
          <label className="mv-label">VIN</label>
          <input className="mv-input" {...register("vin", { pattern: /\d+/ })} />
          {errors.vin && <label className="mv-label">Please enter number for VIN.</label>}
        </div>

        <Button color={"BC-Gov-PrimaryButton"} className={"mt-5"} onClick={handleSubmit((data) => console.log(data))}>
          Submit
        </Button>

      </form>
    </div>
  );
};
