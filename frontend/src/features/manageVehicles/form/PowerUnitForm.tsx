import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button } from "../../../common/components/button/Button";
import "./VehicleForm.scss";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AxleGroupForm } from "./AxleGroupForm";

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

    const onAddVehicle = function () {

        console.log("Function call");
    }

    const { t } = useTranslation();
    return (
        <div>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="add-power-unit-content"
                    id="add-power-unit-accordion-summary"
                >
                    {t('vehicle.power-unit-details')}
                </AccordionSummary>
                <AccordionDetails>
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
                            <input className="mv-input" {...register("vin", { required: true, })} />
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
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="add-axle-group-content"
                    id="add-axle-group-accordion-summary"
                >
                    {t('vehicle.axle-group')}
                </AccordionSummary>
                <AccordionDetails>
                    <AxleGroupForm />
                </AccordionDetails>
            </Accordion>
            <div>

            
            <Button color={"BC-Gov-PrimaryButton"}
                key="add-vehicle-button"
                className={"mt-5"}
                onClick={handleSubmit(onAddVehicle)}>
                {t('vehicle.form.submit')}
            </Button>
            </div>
        </div>
    );
};