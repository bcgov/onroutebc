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
import { useQuery } from "@tanstack/react-query";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { ONE_HOUR } from "../../../../common/constants/constants";
import { ALL_CONSOLIDATED_PAYMENT_METHODS } from "../../../../common/types/paymentMethods";
import { BC_COLOURS } from "../../../../themes/bcGovStyles";
import { SELECT_FIELD_STYLE } from "../../../../themes/orbcStyles";
import {
  PaymentAndRefundDetailRequest,
  PaymentCodes,
  getPermitTypes,
} from "../../search/api/reports";
import {
  getPermitIssuers,
  usePermitIssuersQuery,
} from "../../search/api/users";
import "./style.scss";

/**
 * Component for Payment and Refund Detail form
 *
 */
export const PaymentAndRefundDetail = () => {
  // GET the permit types.
  const permitTypesQuery = useQuery({
    queryKey: ["permitTypes"],
    queryFn: () => getPermitTypes(),
    select: (data) => {
      return {
        "All Permit Types": "ALL",
        ...data,
      };
    },
    keepPreviousData: true,
    staleTime: ONE_HOUR,
  });

  const { data: permitTypes, isLoading: isPermitTypeQueryLoading } =
    permitTypesQuery;

  const [selectedPermitTypes, setSelectedPermitTypes] = useState<string[]>([]);

  useEffect(() => {
    if (permitTypes) {
      setSelectedPermitTypes(() => Object.keys(permitTypes) as string[]);
    }
  }, [isPermitTypeQueryLoading]);

  // GET the list of users who have issued a permit.
  const permitIssuersQuery = useQuery({
    queryKey: ["idirUsers"],
    queryFn: getPermitIssuers,
    select: (data) => {
      return [{ userGUID: "All Users", userName: "All Users" }, ...data];
    },
    keepPreviousData: true,
    staleTime: ONE_HOUR,
    retry: false,
    refetchOnWindowFocus: false, // prevents unnecessary queries
  });

  const [selectedPaymentCodes, setSelectedPaymentCodes] = useState<string[]>([
    "All Payment Methods",
  ]);
  const [users, setUsers] = useState<string[]>(["ALL"]);

  const [issuedBy, setIssuedBy] = useState<string[]>(["SELF_ISSUED", "PPC"]);
  const [fromDateTime, setFromDateTime] = useState<Dayjs>(
    dayjs()
      .subtract(1, "day")
      .set("h", 21)
      .set("m", 0)
      .set("s", 0)
      .set("ms", 0),
  );
  const [toDateTime, setToDateTime] = useState<Dayjs>(
    dayjs().set("h", 20).set("m", 59).set("s", 59).set("ms", 999),
  );
  /**
   * Opens the report in a new tab.
   */
  const onClickViewReport = async () => {
    try {
      const requestObj: PaymentAndRefundDetailRequest = {
        fromDateTime: fromDateTime.toISOString(),
        toDateTime: toDateTime.toISOString(),
        issuedBy,
        paymentCodes: selectedPaymentCodes.map((key: string) => {
          const { paymentMethodTypeCode, paymentCardTypeCode } =
            ALL_CONSOLIDATED_PAYMENT_METHODS[key];
          const paymentCodes: PaymentCodes = {
            paymentMethodTypeCode,
          };
          if (paymentCardTypeCode) {
            paymentCodes.paymentCardTypeCode = paymentCardTypeCode;
          }
          return paymentCodes;
        }),
        permitType: selectedPermitTypes,
      };
      if (issuedBy.includes("PPC")) {
        requestObj.users = users;
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

  const ppcList = [
    {
      name: "All Users",
      userGUID: "ALL",
      username: "ALL",
    },
    {
      name: "KRSUBRAM",
      userGUID: "KRSUBRAMXYZ123",
      username: "KRSUBRAM",
    },
    {
      name: "ANPETRIC",
      userGUID: "ANPETRICXYZ123",
      username: "ANPETRIC",
    },
    {
      name: "BABEL",
      userGUID: "BABELXYZ123",
      username: "BABEL",
    },
    {
      name: "GERIDEOU",
      userGUID: "GERIDEOUXYZ123",
      username: "GERIDEOU",
    },
  ];

  const permitTypes2 = {
    "All Permit Types": "ALL",
    EPTOP: "Extra-Provincial Temporary Operating",
    HC: "Highway Crossing",
    LCV: "Long Combination Vehicle",
    MFP: "Motive Fuel User",
    NRQBS: "Quarterly Non Resident Reg. / Ins. - Bus",
    NRQCL: "Non Resident Quarterly Conditional License",
    NRQCV: "Quarterly Non Resident Reg. / Ins. - Comm Vehicle",
    NRQFT: "Non Resident Quarterly Farm Tractor",
    NRQFV: "Quarterly Non Resident Reg. / Ins. - Farm Vehicle",
    NRQXP: "Non Resident Quarterly X Plated",
    NRSBS: "Single Trip Non-Resident Registration / Insurance -Buses",
    NRSCL: "Non Resident Single Trip Conditional License",
    NRSCV: "Single Trip Non-Resident Reg. / Ins. - Commercial Vehicle",
    NRSFT: "Non Resident Farm Tractor Single Trip",
    NRSFV: "Single Trip Non Resident Reg. / Ins. - Farm Vehicle",
    NRSXP: "Non Resident Single Trip X Plated Vehicle",
    RIG: "Rig Move",
    STOS: "Single Trip Oversize",
    STOW: "Single Trip Over Weight",
    STWS: "Single Trip Overweight Oversize",
    TRAX: "Term Axle Overweight",
    TROS: "Term Oversize",
    TROW: "Term Overweight",
  };

  const onSelectPermitType = (
    event: SelectChangeEvent<typeof selectedPermitTypes>,
  ) => {
    const {
      target: { value },
    } = event;
    if (permitTypes) {
      const permitTypeKeys = Object.keys(permitTypes);
      const totalPermitTypes = permitTypeKeys.length;
      if (Array.isArray(value)) {
        if (value.includes("All Permit Types")) {
          if (value.length < totalPermitTypes) {
            setSelectedPermitTypes(() => Object.keys(permitTypes) as string[]);
          }
          if (selectedPermitTypes.length < totalPermitTypes) {
//
          }
        }
      }
      if (value === "All Permit Types") {
        setSelectedPermitTypes(() => Object.keys(permitTypes) as string[]);
      } else {
        console.log("value::", value);
        console.log("typeof value::", typeof value);

        /**
         * value includes all =>
         *    if (selectedPermitTypes.length < permitTypes.length) {
         *      
         * }
         *
         * */
        //
        /**
         * if value does not include all
         *    if
         */

        if (value.includes("All Permit Types")) {
          // value in
          // Check if the length of the array = length of state
          // cosk
          // value.split(",")
          // setSelectedPermitTypes(
          //   () =>
          //     Object.keys(permitTypes).filter(
          //       (value) => value !== "All Permit Types",
          //     ) as string[],
          // );
        }
        setSelectedPermitTypes(() =>
          typeof value === "string" ? value.split(",") : value,
        );
      }
    }
  };

  const onSelectUser = (event: SelectChangeEvent<typeof users>) => {
    const {
      target: { value },
    } = event;
    setUsers(
      // On autofill we get a stringified value.
      () => (typeof value === "string" ? value.split(",") : value),
    );
  };

  const onSelectPaymentMethod = (
    event: SelectChangeEvent<typeof selectedPermitTypes>,
  ) => {
    const {
      target: { value },
    } = event;
    setSelectedPaymentCodes(
      // On autofill we get a stringified value.
      () => {
        return typeof value === "string" ? value.split(",") : value;
      },
    );
  };
  return (
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
                    setIssuedBy(() => [...issuedBy, "SELF_ISSUED"]);
                  } else {
                    setIssuedBy(() =>
                      issuedBy.filter((value) => value !== "SELF_ISSUED"),
                    );
                  }
                  //   const issuedBy = getValues("issuedBy");
                  //   if (checked) {
                  //     issuedBy.push("SELF_ISSUED");
                  //   } else {
                  //     delete issuedBy[issuedBy.indexOf("SELF_ISSUED")];
                  //   }
                  //   setValue("issuedBy", issuedBy);
                }}
                checked={issuedBy.includes("SELF_ISSUED")}
                sx={{ marginLeft: "0px", paddingLeft: "0px" }}
                name="issuedBy"
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
                    setIssuedBy(() => [...issuedBy, "PPC"]);
                  } else {
                    setIssuedBy(() =>
                      issuedBy.filter((value) => value !== "PPC"),
                    );
                  }
                }}
                checked={issuedBy.includes("PPC")}
                sx={{ marginLeft: "0px", paddingLeft: "0px" }}
                name="issuedBy"
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
              disabled={issuedBy.length === 0}
            >
              <FormLabel
                className="custom-form-control__label"
                id="payment-method-select"
                sx={{ fontWeight: "bold", marginBottom: "8px" }}
              >
                Permit Type
              </FormLabel>
              <Select
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                multiple
                onChange={onSelectPermitType}
                renderValue={(selected) => {
                  if (selectedPermitTypes.includes("All Permit Types")) {
                    return "All Permit Types";
                  }
                  // const selectedLabels: string[] = [];
                  // selected.forEach((selectedValue) => {
                  //   selectedLabels.push(
                  //     permitTypes2.find(({ value }) => value === selectedValue)
                  //       ?.label as string,
                  //   );
                  // });
                  // return selectedLabels.join(", ");
                  return selected.join(", ");
                }}
                input={<OutlinedInput />}
                value={selectedPermitTypes}
                // inputProps={{ shrink: "false" }}
              >
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
              </Select>
            </FormControl>
          </Stack>

          <Stack>
            <FormControl
              sx={{ width: "274px" }}
              className="custom-form-control"
              margin="normal"
              disabled={issuedBy.length === 0}
            >
              <FormLabel
                className="custom-form-control__label"
                id="payment-method-select"
                sx={{ fontWeight: "bold", marginBottom: "8px" }}
              >
                Payment Method
              </FormLabel>
              <Select
                labelId="demo-multiple-name-label"
                id="demo-multiple-payment-method"
                multiple
                onChange={onSelectPaymentMethod}
                renderValue={(selected) => selected.join(", ")}
                input={<OutlinedInput />}
                value={selectedPaymentCodes}
              >
                {Object.keys(ALL_CONSOLIDATED_PAYMENT_METHODS).map((key) => (
                  <MenuItem key={key} value={key}>
                    <Checkbox
                      checked={selectedPaymentCodes.indexOf(key) > -1}
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
              disabled={!issuedBy.includes("PPC")}
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
                  const selectedLabels: string[] = [];
                  selected.forEach((selectedValue) => {
                    selectedLabels.push(
                      ppcList.find(({ username }) => username === selectedValue)
                        ?.name as string,
                    );
                  });

                  return selectedLabels.join(", ");
                  // return selected.join(", ");
                }}
                input={<OutlinedInput />}
                defaultValue={["All Users"]}
                value={users}
                aria-labelledby="users-select"
                sx={SELECT_FIELD_STYLE.SELECT_FIELDSET}
                inputProps={{
                  "aria-label": "users-select",
                }}
              >
                {ppcList.map(({ name, userGUID, username }) => (
                  <MenuItem key={userGUID} value={username}>
                    <Checkbox checked={users.indexOf(username) > -1} />
                    <ListItemText primary={name} />
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
                sx={{ width: "100%" }}
                disabled={issuedBy.length === 0}
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
                      setFromDateTime(() => value as Dayjs);
                    }}
                    disabled={issuedBy.length === 0}
                    views={["year", "month", "day", "hours", "minutes"]}
                  />
                </LocalizationProvider>
              </FormControl>
            </>
            <>
              <FormControl
                className="custom-form-control"
                margin="normal"
                sx={{ width: "100%" }}
                disabled={issuedBy.length === 0}
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
                    disabled={issuedBy.length === 0}
                    onChange={(value: Dayjs | null) => {
                      setToDateTime(() => value as Dayjs);
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
              disabled={issuedBy.length === 0}
              onClick={onClickViewReport}
            >
              View Report
            </Button>
          </Stack>
        </Stack>
      </FormGroup>
    </Stack>
  );
};
