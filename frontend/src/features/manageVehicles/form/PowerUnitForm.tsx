import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button } from "../../../common/components/button/Button";
import "./VehicleForm.scss";

/**
 * 
 * @returns 
 */
export const PowerUnitForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const { t } = useTranslation();
    return (
        <div id="add-power-unit" className="mv-form-container">
            <form className="mv-form">
                <div>
                    <label className="mv-label">{t('power-unit.unit-number')}</label>
                    <input className="mv-input" {...register("unit-number", { 
                        required: true,
                    })} />
                </div>
                <div>
                    <label className="mv-label">{t('power-unit.make')}</label>
                    <input className="mv-input" {...register("make")} />
                </div>
                <div>
                    <label className="mv-label">{t('power-unit.year')}</label>
                    <input className="mv-input" {...register("year", { required: true })} />
                    {errors.year && <label className="mv-label">Year is required.</label>}
                </div>
                <div>
                    <label className="mv-label">{t('power-unit.vin')}</label>
                    <input className="mv-input" {...register("vin", { required: true,  })} />
                    {errors.vin && <label className="mv-label">Please enter number for VIN.</label>}
                </div>
                <div>
                    <label className="mv-label">{t('power-unit.plate')}</label>
                    <input className="mv-input" {...register("plate", { required: true })} />
                    {errors.vin && <label className="mv-label">Please enter number for VIN.</label>}
                </div>
                <div>
                    <label className="mv-label">{t('power-unit.power-unit-type')}</label>
                    <input className="mv-input" {...register("unit-number")} />
                </div>
        

                <Button color={"BC-Gov-PrimaryButton"} className={"mt-5"} onClick={handleSubmit((data) => console.log(data))}>
                    Submit
                </Button>

            </form>
        </div>
    );
};