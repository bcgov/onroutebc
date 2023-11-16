import {
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Stack,
  FormLabel,
} from "@mui/material";
import { BC_COLOURS } from "../../../../themes/bcGovStyles";
import {
  DateTimePicker,
  DesktopDateTimePicker,
  LocalizationProvider,
  pickersLayoutClasses,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  PaymentAndRefundDetailRequest,
  PaymentMethodTypeSubObject,
  getPaymentAndRefundDetail,
  getPaymentAndRefundSummary,
} from "../../search/api/reports";
import { openBlobInNewTab } from "../../../permits/helpers/permitPDFHelper";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { SELECT_FIELD_STYLE } from "../../../../themes/orbcStyles";
import { getPaymentMethodAndTypes } from "../../../../common/types/payment";
import "./style.scss";
import { PaymentMethodAndTypeRecord } from "../../../../common/types/payment2";

const sample = {
  issuedBy: ["SELF"],
  paymentMethodType: ["ALL"],
  permitType: ["ALL"],
  fromDateTime: "2023-10-11T23:26:51.170Z",
  toDateTime: "2023-10-27T23:26:51.170Z",
  users: ["ORBCTST1"],
};

/**
 * Component for Payment and Refund Detail form
 *
 */
export const PaymentAndRefundDetail = () => {
  const [permitType, setPermitType] = useState<string[]>(["ALL"]);
  const [paymentMethodType, setPaymentMethodType] = useState<string[]>([
    "All Payment Methods",
  ]);
  const [users, setUsers] = useState<string[]>(["ALL"]);
  const [issuedBy, setIssuedBy] = useState<string[]>(["SELF", "PPC"]);
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
    console.log(PaymentMethodAndTypeRecord);

    console.log("paymentMethodType::", paymentMethodType);
    try {
      const requestObj: PaymentAndRefundDetailRequest = {
        fromDateTime: fromDateTime.toISOString(),
        toDateTime: toDateTime.toISOString(),
        issuedBy,
        // paymentMethodType: paymentMethodType,
        // paymentMethods: paymentMethods.filter(({ display, paymentMethodTypeId, paymentTypeId}) => {
        //   const retArray: PaymentMethodTypeSubObject[] = [];
        //   paymentMethodType.forEach((type) => {
        //     const sss = paymentMethods.find((paymentMethod) => paymentMethod.display === type );
        //     retArray.push({
        //       paymentMethodTypeId: sss?.paymentMethodTypeId as string,
        //       paymentTypeId: sss?.paymentTypeId
        //     })
        //   });
        //   return retArray;

        // }),
        // paymentMethods: paymentMethods
        //   .filter(({ display }) => paymentMethodType.includes(display))
        //   .map(({ paymentMethodTypeId, paymentType }) => {
        //     return {
        //       paymentMethodTypeId,
        //       paymentType,
        //     };
        //   }),
        paymentMethods: paymentMethodType.map((key: string) => {
          const { paymentMethodTypeId, paymentType } =
            PaymentMethodAndTypeRecord[key];
          if (paymentType) {
            return {
              paymentMethodTypeId,
              paymentType,
            };
          }
          return {
            paymentMethodTypeId
          }
        }),
        permitType,
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

  const permitTypes = ["ALL", "TROS"];

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

  const permitTypes2 = [
    {
      label: "All Permit Types",
      value: "ALL",
    },
    {
      label: "TROS",
      value: "TROS",
    },
    {
      label: "TROW",
      value: "TROW",
    },
  ];
  const paymentMethods = getPaymentMethodAndTypes();

  // console.log(paymentMethods);

  const onSelectPermitType = (event: SelectChangeEvent<typeof permitType>) => {
    const {
      target: { value },
    } = event;
    setPermitType(() => (typeof value === "string" ? value.split(",") : value));
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
    event: SelectChangeEvent<typeof permitType>,
  ) => {
    const {
      target: { value },
    } = event;
    setPaymentMethodType(
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
                    setIssuedBy(() => [...issuedBy, "SELF"]);
                  } else {
                    setIssuedBy(() =>
                      issuedBy.filter((value) => value !== "SELF"),
                    );
                  }
                  //   const issuedBy = getValues("issuedBy");
                  //   if (checked) {
                  //     issuedBy.push("SELF");
                  //   } else {
                  //     delete issuedBy[issuedBy.indexOf("SELF")];
                  //   }
                  //   setValue("issuedBy", issuedBy);
                }}
                checked={issuedBy.includes("SELF")}
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
                  const selectedLabels: string[] = [];
                  selected.forEach((selectedValue) => {
                    selectedLabels.push(
                      permitTypes2.find(({ value }) => value === selectedValue)
                        ?.label as string,
                    );
                  });
                  return selectedLabels.join(", ");
                  // return selected.join(", ");
                }}
                input={<OutlinedInput />}
                value={permitType}
                // inputProps={{ shrink: "false" }}
              >
                {permitTypes2.map(({ label, value }) => {
                  return (
                    <MenuItem key={label} value={value}>
                      <Checkbox checked={permitType.indexOf(value) > -1} />
                      <ListItemText primary={label} />
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
                // renderValue={(selected) => {
                //   const selectedLabels: string[] = [];
                //   selected.forEach((selectedValue) => {
                //     console.log("selectedValue::", selectedValue);
                //     selectedLabels.push(
                //       paymentMethods.find(
                //         ({ display }) => display === selectedValue,
                //       )?.display as string,
                //     );
                //   });

                //   return selectedLabels.join(", ");
                //   // return selected.join(", ");
                // }}
                renderValue={(selected) => selected.join(", ")}
                input={<OutlinedInput />}
                value={paymentMethodType}
              >
                {[
                  "All Payment Methods",
                  ...Object.keys(PaymentMethodAndTypeRecord),
                ].map((key) => (
                  <MenuItem key={key} value={key}>
                    <Checkbox checked={paymentMethodType.indexOf(key) > -1} />
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
                    console.log("selectedValue::", selectedValue);
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
                  {/* <DesktopDateTimePicker /> */}
                  {/* <DateTimePicker disableFuture openTo="hours"/> */}
                  <DateTimePicker
                    defaultValue={dayjs()
                      .subtract(1, "day")
                      .set("h", 21)
                      .set("m", 0)
                      .set("s", 0)
                      .set("ms", 0)}
                    //   label={<strong>From</strong>}
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
                    // slotProps={{
                    //   textField: {
                    //     helperText: "Select a from date time",
                    //   },
                    // }}
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
                  {/* <DesktopDateTimePicker /> */}
                  {/* <DateTimePicker disableFuture openTo="hours"/> */}
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
                    // defaultValue={new Date(fromDateTime)}
                    //   label={<strong>To</strong>}
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
            {/* <FormControlLabel
            disabled={issuedBy.length === 0}
            control={
              
            }
            label={<strong>From</strong>}
            labelPlacement="top"
          /> */}
            {/* <FormControlLabel
            disabled={issuedBy.length === 0}
            control={
              
            }
            label={<strong>To</strong>}
            labelPlacement="top"
          /> */}
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
