import { useForm, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import "./VehicleForm.scss";
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { Vehicle } from "../../../constants/enums";
import { AxleFrontGroup, AxleType } from "../types";
import Input from '@mui/material/Input';
import FilledInput from '@mui/material/FilledInput';
import OutlinedInput from '@mui/material/OutlinedInput';

/**
 * The AxleGroupForm component provides a form containing the fields pertaining
 * to axle groups. It is only intended to be a subsection in a bigger component.
 * @returns A react component with axle group form fields.
 */
export const AxleGroupForm = () => {
    const translationPrefix = 'vehicle.axle-group';
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const boldTextStyle = {
        fontWeight: 'bold'
    };

    const { t } = useTranslation();
    return (
        <div id="axle-group-form">
            <div>
                <FormControl margin="normal">
                    <FormLabel id="axle-front-group-radiogroup"  sx={boldTextStyle}>
                        {t(`${translationPrefix}.axle-front-group`)}
                    </FormLabel>
                    <RadioGroup
                        row
                        aria-labelledby="axle-front-group-radiogroup"
                        name="axle-front-group-radiogroup"
                    >
                        <FormControlLabel value={AxleFrontGroup.Single} control={<Radio />} label={t(`${translationPrefix}.axle-front-group.single`)} />
                        <FormControlLabel value={AxleFrontGroup.Tandem} control={<Radio />} label={t(`${translationPrefix}.axle-front-group.tandem`)} />
                        <FormControlLabel value={AxleFrontGroup.Tridem} control={<Radio />} label={t(`${translationPrefix}.axle-front-group.tridem`)} />
                    </RadioGroup>
                </FormControl>
            </div>
            <div>
                <FormControl margin="normal">
                    <FormLabel id="axle-type-front-radiogroup" sx={boldTextStyle}>
                        {t(`${translationPrefix}.axle-type-front`)}
                    </FormLabel>
                    <RadioGroup
                        row
                        aria-labelledby="axle-type-front-radiogroup"
                        name="axle-type-front-radiogroup"
                    >
                        <FormControlLabel value={AxleType.Steering} control={<Radio />} label={t(`${translationPrefix}.axle-type.steering`)} />
                        <FormControlLabel value={AxleType.Drive} control={<Radio />} label={t(`${translationPrefix}.axle-type.drive`)} />
                    </RadioGroup>
                </FormControl>
            </div>
            <div>
                <FormControl margin="normal">
                    <FormLabel id="axle-type-rear-radiogroup" sx={boldTextStyle}>
                        {t(`${translationPrefix}.axle-type-rear`)}
                    </FormLabel>
                    <RadioGroup
                        row
                        aria-labelledby="axle-type-rear-radiogroup"
                        name="axle-type-rear-radiogroup"
                    >
                        <FormControlLabel value={AxleType.Steering} control={<Radio />} label={t(`${translationPrefix}.axle-type.steering`)} />
                        <FormControlLabel value={AxleType.Drive} control={<Radio />} label={t(`${translationPrefix}.axle-type.drive`)} />
                    </RadioGroup>
                </FormControl>
            </div>
            <div>
                {/* <FormLabel>{t('vehicle.axle-group.axle-group-number')}</FormLabel> */}
                <FormControl margin="normal">
                    <FormLabel id="axle-group-number-label" sx={boldTextStyle}>
                        {t('vehicle.axle-group.axle-group-number')}
                    </FormLabel>
                    <OutlinedInput
                        aria-labelledby="axle-group-number-label"

                    />
                </FormControl>
                {/* <TextField 
                    label={t('vehicle.axle-group.axle-group-number')}
                    variant="outlined"
                    margin="normal" 
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} 
                /> */}
            </div>
            <div>
                <FormControl margin="normal">
                    <FormLabel id="axle-group-spacing-label" sx={boldTextStyle}>
                        {t('vehicle.axle-group.axle-group-spacing')}
                    </FormLabel>
                    <OutlinedInput
                        aria-labelledby="axle-group-spacing-label"
                        margin="dense"
                    />
                </FormControl>

            </div>
            <div>
                <FormControl margin="normal">
                    <FormLabel id="interaxle-spread-front-label" sx={boldTextStyle}>
                        {t('vehicle.axle-group.interaxle-spread-front')}
                    </FormLabel>
                    <OutlinedInput
                        aria-labelledby="interaxle-spread-front-label"
                        margin="dense"
                    />
                </FormControl>

            </div>
            <div>
                <FormControl margin="normal">
                    <FormLabel id="interaxle-spread-front-label" sx={boldTextStyle}>
                        {t('vehicle.axle-group.interaxle-spread-front')}
                    </FormLabel>
                    <OutlinedInput
                        aria-labelledby="interaxle-spread-front-label"
                        margin="dense"
                    />
                </FormControl>

                {/* <TextField
                    label={t('vehicle.axle-group.interaxle-spread-rear')}
                    variant="outlined"
                    margin="normal"
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                /> */}
            </div>
            <div>

                <FormControl margin="normal">
                    <FormLabel id="interaxle-spread-front-label" sx={boldTextStyle}>
                        {t('vehicle.axle-group.interaxle-spread-front')}
                    </FormLabel>
                    <OutlinedInput
                        aria-labelledby="interaxle-spread-front-label"
                        margin="dense"
                    />
                </FormControl>
                {/* <TextField
                    label={t('vehicle.axle-group.number-of-tires-front')}
                    variant="outlined"
                    margin="normal"
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                /> */}
            </div>
            <div>
                <FormControl margin="normal">
                    <FormLabel id="number-of-tires-rear-label" sx={boldTextStyle}>
                        {t('vehicle.axle-group.number-of-tires-rear')}
                    </FormLabel>
                    <OutlinedInput
                        aria-labelledby="number-of-tires-rear-label"
                        margin="dense"
                    />
                </FormControl>
                {/* <TextField
                    label={t('vehicle.axle-group.number-of-tires-rear')}
                    variant="outlined"
                    margin="normal"
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                /> */}
            </div>
        </div>
    );
};