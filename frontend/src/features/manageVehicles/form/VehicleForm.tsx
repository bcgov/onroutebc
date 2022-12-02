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
          <label className="mv-label">First Name</label>
          <input className="mv-input" {...register("firstName")} />
        </div>
        <div>
          <label className="mv-label">Last Name</label>
          <input className="mv-input" {...register("lastName", { required: true })} />
          {errors.lastName && <label className="mv-label">Last name is required.</label>}
        </div>
        <div>
          <label className="mv-label">Age</label>
          <input className="mv-input" {...register("age", { pattern: /\d+/ })} />
          {errors.age && <label className="mv-label">Please enter number for age.</label>}
        </div>

        <Button color={"BC-Gov-PrimaryButton"} className={"mt-5"} onClick={handleSubmit((data) => console.log(data))}>
          Submit
        </Button>

      </form>
    </div>
  );
};
