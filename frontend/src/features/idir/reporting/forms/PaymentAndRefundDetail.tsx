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
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  PaymentAndRefundDetailRequest,
  getPaymentAndRefundDetail,
  getPaymentAndRefundSummary,
} from "../../search/api/reports";
import { openBlobInNewTab } from "../../../permits/helpers/permitPDFHelper";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { SELECT_FIELD_STYLE } from "../../../../themes/orbcStyles";

const sample = {
  issuedBy: ["SELF"],
  paymentMethodType: ["ALL"],
  permitType: ["ALL"],
  fromDateTime: "2023-10-11T23:26:51.170Z",
  toDateTime: "2023-10-27T23:26:51.170Z",
  users: ["ORBCTST1"],
};

export const PaymentAndRefundDetail = () => {
  const [requestObject, setRequestObject] =
    useState<PaymentAndRefundDetailRequest>();
  const [permitType, setPermitType] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<string[]>([]);
  const [users, setUsers] = useState<string[]>([]);
  const [selfIssued, setSelfIssued] = useState<boolean>(true);
  const [ppcIssued, setPPCIssued] = useState<boolean>(true);
  const [issuedBy, setIssuedBy] = useState<string[]>(["SELF", "PPC"]);
  const [fromDateTime, setFromDateTime] = useState<Dayjs>(
    dayjs().subtract(1, "day").set("h", 21).set("m", 0).set("s", 0).set("ms", 0)
  );
  const [toDateTime, setToDateTime] = useState<Dayjs>(
    dayjs().set("h", 20).set("m", 59).set("s", 59).set("ms", 999)
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
        paymentMethodType: paymentMethod,
        permitType,
        users,
      };
      console.log("requestObj::", requestObj);
      //   const { blobObj: blobObjWithoutType } = await getPaymentAndRefundDetail(
      //     requestObj
      //   );
      //   openBlobInNewTab(blobObjWithoutType);
    } catch (err) {
      console.error(err);
    }
  };

  const permitTypes = ["ALL", "TROS"];
  const paymentMethods = [
    {
      key: "All Payment Methods",
      value: "ALL",
    },
    {
      key: "Web - AMEX",
      value: "WEBAM",
    },
    {
      key: "Web - Visa",
      value: "WEBVI",
    },
    {
      key: "Web - Mastercard",
      value: "WEBMC",
    },
  ];

  const handleChange = (event: SelectChangeEvent<typeof permitType>) => {
    const {
      target: { value },
    } = event;
    setUsers(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const onSelectUser = (event: SelectChangeEvent<typeof users>) => {
    const {
      target: { value },
    } = event;
    setPermitType(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const onSelectPaymentMethod = (
    event: SelectChangeEvent<typeof permitType>
  ) => {
    const {
      target: { value },
    } = event;
    setPaymentMethod(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
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
                onChange={() => setSelfIssued((prevState) => !prevState)}
                checked={selfIssued}
                sx={{ marginLeft: "0px", paddingLeft: "0px" }}
                name="issuedBy"
              />
            }
            label="Self Issued"
          />
          <FormControlLabel
            control={
              <Checkbox
                onChange={() => setPPCIssued((prevState) => !prevState)}
                checked={ppcIssued}
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
            <FormControl sx={{ width: "274px" }}>
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
                onChange={handleChange}
                renderValue={(selected) => selected.join(", ")}
                input={<OutlinedInput label="Permit Type" />}
                value={permitType}
              >
                {permitTypes.map((permitType) => (
                  <MenuItem key={permitType} value={permitType}>
                    <Checkbox checked={permitType.indexOf(permitType) > -1} />
                    <ListItemText primary={permitType} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <Stack >
            <FormControl
              sx={{ width: "274px" }}
              className="custom-form-control"
              margin="normal"
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
                input={<OutlinedInput label="Payment Method" />}
                value={paymentMethod}
              >
                {paymentMethods.map(({ key, value }) => (
                  <MenuItem key={key} value={value}>
                    <Checkbox checked={permitType.indexOf(key) > -1} />
                    <ListItemText primary={value} />
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
                onChange={handleChange}
                renderValue={(selected) => selected.join(", ")}
                input={<OutlinedInput label="Users" />}
                defaultValue={["All Users"]}
                value={users}
                aria-labelledby="users-select"
                sx={SELECT_FIELD_STYLE.SELECT_FIELDSET}
                inputProps={{
                  "aria-label": "users-select",
                }}
              >
                {["All Users"].map((user) => (
                  <MenuItem key={user} value={user}>
                    <Checkbox checked={users.indexOf(user) > -1} />
                    <ListItemText primary={user} />
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
          <Stack direction="row">
            <Button
              key="view-report-button"
              aria-label="View Report"
              variant="contained"
              color="primary"
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
