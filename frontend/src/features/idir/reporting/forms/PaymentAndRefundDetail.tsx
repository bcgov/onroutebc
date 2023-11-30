import {
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Stack,
} from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import {
  ALL_CONSOLIDATED_PAYMENT_METHODS,
  CONSOLIDATED_PAYMENT_METHODS,
} from "../../../../common/types/paymentMethods";
import { BC_COLOURS } from "../../../../themes/bcGovStyles";
import { SELECT_FIELD_STYLE } from "../../../../themes/orbcStyles";
import {
  PaymentAndRefundDetailRequest,
  PaymentCodes,
  usePermitTypesQuery,
} from "../../search/api/reports";
import { usePermitIssuersQuery } from "../../search/api/users";
import "./style.scss";
import { SelectPermitTypes } from "./subcomponents/SelectPermitType";
import { FormProvider, useForm } from "react-hook-form";

interface PaymentAndRefundDetailRequestDayJs {
  permitType: string[];
  paymentMethodTypes?: string[];
  users?: string[];
  fromDateTime: Dayjs;
  toDateTime: Dayjs;
  issuedBy: string[];
}

/**
 * Component for Payment and Refund Detail form
 *
 */
export const PaymentAndRefundDetail = () => {
  // GET the permit types.
  const permitTypesQuery = usePermitTypesQuery();

  const { data: permitTypes, isLoading: isPermitTypeQueryLoading } =
    permitTypesQuery;

  // const [selectedPermitTypes, setSelectedPermitTypes] = useState<string[]>(
  //   permitTypes && Object.keys(permitTypes) ? Object.keys(permitTypes) : [],
  // );

  const [selectedPermitTypes, setSelectedPermitTypes] = useState<string[]>([]);

  const isAllPermitTypesSelected =
    permitTypes &&
    Object.keys(permitTypes).length === selectedPermitTypes.length;

  console.log("selectedPermitTypes::", selectedPermitTypes);
  console.log("isAllPermitTypesSelected::", isAllPermitTypesSelected);

  useEffect(() => {
    console.log("isPermitTypeQueryLoading::", isPermitTypeQueryLoading);
    if (permitTypes) {
      setSelectedPermitTypes(() => Object.keys(permitTypes) as string[]);
    }
  }, [isPermitTypeQueryLoading]);

  // console.log("selectedPermitTypes after useEffect::", selectedPermitTypes);
  // console.log("permitTypes after useEffect::", permitTypes);

  // GET the list of users who have issued a permit.
  const permitIssuersQuery = usePermitIssuersQuery();

  const { data: permitIssuers, isLoading: ispermitIssuersQueryLoading } =
    permitIssuersQuery;
  const [selectedIssuers, setSelectedIssuers] = useState<string[]>([]);
  const isAllUsersSelected =
    permitIssuers && selectedIssuers.length === permitIssuers.length;

  useEffect(() => {
    if (permitIssuers) {
      setSelectedPermitTypes(() => Object.keys(permitIssuers) as string[]);
    }
  }, [ispermitIssuersQueryLoading]);

  // const [selectedPaymentCodes, setSelectedPaymentCodes] = useState<string[]>([
  //   "All Payment Methods",
  // ]);

  const formMethods = useForm<PaymentAndRefundDetailRequestDayJs>({
    defaultValues: {
      issuedBy: ["SELF_ISSUED", "PPC"],
      fromDateTime: dayjs()
        .subtract(1, "day")
        .set("h", 21)
        .set("m", 0)
        .set("s", 0)
        .set("ms", 0),
      toDateTime: dayjs().set("h", 20).set("m", 59).set("s", 59).set("ms", 999),
      paymentMethodTypes: Object.keys(CONSOLIDATED_PAYMENT_METHODS),
      permitType: Object.keys(permitTypes ?? []),
      users: permitIssuers?.map(({ userGUID }) => userGUID),
    },
    reValidateMode: "onBlur",
  });

  const { watch, register, setValue } = formMethods;

  const issuedByForm = watch("issuedBy");
  const fromDateTimeForm = watch("fromDateTime");
  const toDateTimeForm = watch("toDateTime");
  const paymentMethodTypesForm = watch("paymentMethodTypes");
  
  const isAllPaymentMethodsSelected =
    Object.keys(CONSOLIDATED_PAYMENT_METHODS).length ===
    paymentMethodTypesForm?.length;
  console.log("issuedByForm::", issuedByForm);
  console.log("fromDateTimeForm::", fromDateTimeForm.toISOString());
  console.log("toDateTimeForm::", toDateTimeForm.toISOString());
  console.log("paymentMethodTypesForm::", paymentMethodTypesForm);

  const getSelectedPaymentCodes = (): PaymentCodes[] => {
    const paymentCodes: PaymentCodes[] = [];
    if (isAllPaymentMethodsSelected) {
      const { paymentMethodTypeCode, paymentCardTypeCode } =
        ALL_CONSOLIDATED_PAYMENT_METHODS["All Payment Methods"];
      paymentCodes.push({ paymentMethodTypeCode, paymentCardTypeCode });
    }
    return paymentCodes.concat(
      paymentMethodTypesForm ? paymentMethodTypesForm.map((key: string) => {
        const { paymentMethodTypeCode, paymentCardTypeCode } =
          ALL_CONSOLIDATED_PAYMENT_METHODS[key];
        const paymentCodes: PaymentCodes = {
          paymentMethodTypeCode,
        };
        if (paymentCardTypeCode) {
          paymentCodes.paymentCardTypeCode = paymentCardTypeCode;
        }
        return paymentCodes;
      }): [],
    );
  };

  const getSelectedPermitTypes = (): string[] => {
    return isAllPermitTypesSelected
      ? ["ALL"].concat(selectedPermitTypes)
      : selectedPermitTypes;
  };

  /**
   * Opens the report in a new tab.
   */
  const onClickViewReport = async () => {
    try {
      const requestObj: PaymentAndRefundDetailRequest = {
        fromDateTime: fromDateTimeForm.toISOString(),
        toDateTime: toDateTimeForm.toISOString(),
        issuedBy: issuedByForm,
        paymentCodes: getSelectedPaymentCodes(),
        permitType: getSelectedPermitTypes(),
      };
      if (issuedByForm.includes("PPC")) {
        requestObj.users = selectedIssuers;
      }
      console.log("requestObj::", requestObj);
      // const { blobObj: blobObjWithoutType } = await getPaymentAndRefundDetail(
      //   requestObj
      // );
      // openBlobInNewTab(blobObjWithoutType);
    } catch (err) {
      console.error(err);
    }
  };

  const onSelectUser = (event: SelectChangeEvent<typeof selectedIssuers>) => {
    const {
      target: { value },
    } = event;
    setSelectedIssuers(
      // On autofill we get a stringified value.
      () => (typeof value === "string" ? value.split(",") : value),
    );
  };

  /**
   *
   * @param event
   * @returns
   */
  const onSelectPaymentMethod = (
    event: SelectChangeEvent<string[]>,
  ) => {
    const {
      target: { value },
    } = event;
    if (value[value.length - 1] === "All Payment Methods") {
      setValue(
        "paymentMethodTypes",
        paymentMethodTypesForm?.length ===
          Object.keys(CONSOLIDATED_PAYMENT_METHODS).length
          ? []
          : Object.keys(CONSOLIDATED_PAYMENT_METHODS),
      );
      return;
    }
    setValue("paymentMethodTypes", value as string[]);
  };

  return (
    <FormProvider {...formMethods}>
      <Stack style={{ width: "900px" }} spacing={2}>
        <h2>Payment and Refund Detail</h2>
        <Divider
          flexItem
          orientation="horizontal"
          color={BC_COLOURS.bc_border_grey}
        />
        <FormGroup>
          <span>
            <strong>Issued By</strong>
          </span>
          <Stack direction="row" spacing={5}>
            <FormControlLabel
              control={
                <Checkbox
                  onChange={(
                    _event: React.ChangeEvent<HTMLInputElement>,
                    checked: boolean,
                  ) => {
                    if (checked) {
                      // setIssuedBy(() => [...issuedBy, "SELF_ISSUED"]);
                      setValue("issuedBy", [...issuedByForm, "SELF_ISSUED"]);
                    } else {
                      // setIssuedBy(() =>
                      //   issuedBy.filter((value) => value !== "SELF_ISSUED"),
                      // );
                      setValue(
                        "issuedBy",
                        issuedByForm.filter((value) => value !== "SELF_ISSUED"),
                      );
                    }
                  }}
                  checked={issuedByForm.includes("SELF_ISSUED")}
                  sx={{ marginLeft: "0px", paddingLeft: "0px" }}
                  name="issuedBy_SELF"
                />
              }
              label="Self Issued"
            />
            <FormControlLabel
              control={
                <Checkbox
                  onChange={(
                    _event: React.ChangeEvent<HTMLInputElement>,
                    checked: boolean,
                  ) => {
                    if (checked) {
                      // setIssuedBy(() => [...issuedBy, "PPC"]);
                      setValue("issuedBy", [...issuedByForm, "PPC"]);
                    } else {
                      // setIssuedBy(() =>
                      //   issuedBy.filter((value) => value !== "PPC"),
                      // );
                      setValue(
                        "issuedBy",
                        issuedByForm.filter((value) => value !== "PPC"),
                      );
                    }
                  }}
                  checked={issuedByForm.includes("PPC")}
                  sx={{ marginLeft: "0px", paddingLeft: "0px" }}
                  name="issuedBy_PPC"
                />
              }
              label="PPC"
            />
          </Stack>
          <br />
          <Stack spacing={2}>
            <Stack direction="row">
              <FormControl
                sx={{ width: "274px" }}
                disabled={issuedByForm.length === 0}
              >
                <FormLabel
                  className="custom-form-control__label"
                  id="payment-method-select"
                  sx={{ fontWeight: "bold", marginBottom: "8px" }}
                >
                  Permit Type
                </FormLabel>
                {permitTypes && (
                  <SelectPermitTypes
                    key={"Select-Permit-Type"}
                    onSelectCallback={(value) => {
                      setSelectedPermitTypes(() => value);
                    }}
                    permitTypes={permitTypes ?? {}}
                  />
                )}
                {/* <Select
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                multiple
                defaultValue={Object.keys(permitTypes ?? [])}
                onChange={onSelectPermitType}
                renderValue={(selected) => {
                  // console.log("selectedPermitTypes::", selectedPermitTypes);
                  if (isAllPermitTypesSelected) return "All Permit Types";
                  return selected.join(", ");
                }}
                input={<OutlinedInput />}
                value={selectedPermitTypes}
                MenuProps={{
                  autoFocus: false,
                }}
              >
                <MenuItem key="All Permit Types" value="ALL">
                  <Checkbox checked={isAllPermitTypesSelected} />
                  <ListItemText primary={"All Permit Types"} />
                </MenuItem>
                {permitTypes &&
                  Object.keys(permitTypes).map((key) => {
                    return (
                      <MenuItem key={key} value={key}>
                        <Checkbox
                          checked={selectedPermitTypes.indexOf(key) > -1}
                        />
                        <ListItemText primary={key} />
                      </MenuItem>
                    );
                  })}
              </Select> */}
              </FormControl>
            </Stack>

            <Stack>
              <FormControl
                sx={{ width: "274px" }}
                className="custom-form-control"
                margin="normal"
                disabled={issuedByForm.length === 0}
              >
                <FormLabel
                  className="custom-form-control__label"
                  id="payment-method-select-label"
                  sx={{ fontWeight: "bold", marginBottom: "8px" }}
                >
                  Payment Method
                </FormLabel>
                <Select
                  {...register("paymentMethodTypes")}
                  labelId="payment-method-select-label"
                  id="payment-method-select"
                  multiple
                  onChange={onSelectPaymentMethod}
                  renderValue={(selected) => {
                    if (isAllPaymentMethodsSelected)
                      return "All Payment Methods";
                    return selected.join(", ");
                  }}
                  input={<OutlinedInput />}
                  value={paymentMethodTypesForm}
                  MenuProps={{
                    autoFocus: false,
                  }}
                >
                  <MenuItem
                    key={"All Payment Methods"}
                    value={"All Payment Methods"}
                  >
                    <Checkbox checked={isAllPaymentMethodsSelected} />
                    <ListItemText primary={"All Payment Methods"} />
                  </MenuItem>
                  {Object.keys(CONSOLIDATED_PAYMENT_METHODS).map((key) => (
                    <MenuItem key={key} value={key}>
                      <Checkbox
                        checked={paymentMethodTypesForm && paymentMethodTypesForm.indexOf(key) > -1}
                      />
                      <ListItemText primary={key} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <Stack direction="row">
              <FormControl
                sx={{ width: "274px" }}
                className="custom-form-control"
                margin="normal"
                disabled={!issuedByForm.includes("PPC")}
              >
                <FormLabel
                  className="custom-form-control__label"
                  id="users-select"
                  sx={{ fontWeight: "bold", marginBottom: "8px" }}
                >
                  Users
                </FormLabel>
                {/* <InputLabel id="demo-multiple-name-label">
                <strong>Users</strong>
              </InputLabel> */}
                <Select
                  // labelId="demo-multiple-name-label"
                  id="demo-multiple-name"
                  multiple
                  onChange={onSelectUser}
                  // renderValue={(selected) => selected.join(", ")}
                  renderValue={(selected) => {
                    // const selectedLabels: string[] = [];
                    // selected.forEach((selectedValue) => {
                    //   selectedLabels.push(
                    //     ppcList.find(({ username }) => username === selectedValue)
                    //       ?.name as string,
                    //   );
                    // });

                    // return selectedLabels.join(", ");
                    return selected.join(", ");
                  }}
                  input={<OutlinedInput />}
                  // defaultValue={["All Users"]}
                  value={selectedIssuers}
                  aria-labelledby="users-select"
                  sx={SELECT_FIELD_STYLE.SELECT_FIELDSET}
                  inputProps={{
                    "aria-label": "users-select",
                  }}
                >
                  <MenuItem key="All Users" value="All Users">
                    <Checkbox checked={isAllUsersSelected} />
                    <ListItemText primary={"All Users"} />
                  </MenuItem>
                  {permitIssuers &&
                    permitIssuers.map(({ userGUID, userName }) => (
                      <MenuItem key={userGUID} value={userGUID}>
                        <Checkbox
                          checked={selectedIssuers.indexOf(userGUID) > -1}
                        />
                        <ListItemText primary={userName} />
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Stack>
            <Stack direction="row" spacing={3}>
              <>
                <FormControl
                  className="custom-form-control"
                  margin="normal"
                  sx={{ width: "274px" }}
                  disabled={issuedByForm.length === 0}
                >
                  <FormLabel
                    className="custom-form-control__label"
                    id={`label`}
                    sx={{ fontWeight: "bold", marginBottom: "8px" }}
                  >
                    From
                  </FormLabel>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      // {...register("fromDateTime")}
                      defaultValue={dayjs()
                        .subtract(1, "day")
                        .set("h", 21)
                        .set("m", 0)
                        .set("s", 0)
                        .set("ms", 0)}
                      format="YYYY/MM/DD hh:mm A"
                      slotProps={{
                        digitalClockSectionItem: {
                          sx: {
                            width: "76px",
                          },
                        },
                      }}
                      onChange={(value: Dayjs | null) => {
                        setValue("fromDateTime", value as Dayjs);
                      }}
                      disabled={issuedByForm.length === 0}
                      views={["year", "month", "day", "hours", "minutes"]}
                    />
                  </LocalizationProvider>
                </FormControl>
              </>
              <>
                <FormControl
                  className="custom-form-control"
                  margin="normal"
                  sx={{ width: "274px" }}
                  disabled={issuedByForm.length === 0}
                >
                  <FormLabel
                    className="custom-form-control__label"
                    id={`label`}
                    sx={{ fontWeight: "bold", marginBottom: "8px" }}
                  >
                    To
                  </FormLabel>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      disabled={issuedByForm.length === 0}
                      onChange={(value: Dayjs | null) => {
                        // setToDateTime(() => value as Dayjs);
                        setValue("toDateTime", value as Dayjs);
                      }}
                      format="YYYY/MM/DD hh:mm A"
                      defaultValue={dayjs()
                        .set("h", 20)
                        .set("m", 59)
                        .set("s", 59)
                        .set("ms", 999)}
                      views={["year", "month", "day", "hours", "minutes"]}
                      // slotProps={{
                      //   textField: {
                      //     helperText: "Select a from date time",
                      //   },
                      // }}
                    />
                  </LocalizationProvider>
                </FormControl>
              </>
            </Stack>
            <br />
            <Stack direction="row">
              <Button
                key="view-report-button"
                aria-label="View Report"
                variant="contained"
                color="primary"
                disabled={issuedByForm.length === 0}
                onClick={onClickViewReport}
              >
                View Report
              </Button>
            </Stack>
          </Stack>
        </FormGroup>
      </Stack>
    </FormProvider>
  );
};
