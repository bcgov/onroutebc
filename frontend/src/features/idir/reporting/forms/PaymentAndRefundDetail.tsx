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
} from "@mui/material";
import { BC_COLOURS } from "../../../../themes/bcGovStyles";
import {
  DesktopDateTimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { PaymentAndRefundDetailRequest, getPaymentAndRefundSummary } from "../../search/api/reports";
import { openBlobInNewTab } from "../../../permits/helpers/permitPDFHelper";
import { useState } from "react";

const sample = {
  issuedBy: ["SELF"],
  paymentMethodType: ["ALL"],
  permitType: ["ALL"],
  fromDateTime: "2023-10-11T23:26:51.170Z",
  toDateTime: "2023-10-27T23:26:51.170Z",
  users: ["ORBCTST1"],
};

export const PaymentAndRefundDetail = () => {

    const [requestObject, setRequestObject] = useState<PaymentAndRefundDetailRequest>();
  /**
   * Opens the report in a new tab.
   */
  const onClickViewReport = async () => {
    try {
      const { blobObj: blobObjWithoutType } = await getPaymentAndRefundSummary({
        fromDateTime: "2023-10-25T21:00Z",
        toDateTime: "2023-10-25T21:00Z",
        issuedBy: ["SELF", "PPC"],
      });
      openBlobInNewTab(blobObjWithoutType);
    } catch (err) {
      console.error(err);
    }
  };

  const [permitType, setPermitType] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<string[]>([]);
  const [users, setUsers] = useState<string[]>([]);
  const [selfIssued, setSelfIssued] = useState<boolean>(true);
  const [ppcIssued, setPPCIssued] = useState<boolean>(true);

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
        <br />
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
        <Stack spacing={4}>
          <Stack direction="row">
            <FormControl sx={{ width: "274px" }}>
              <InputLabel id="demo-multiple-name-label">
                <strong>Permit Type</strong>
              </InputLabel>
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

          <Stack direction="row">
            <FormControl sx={{ width: "274px" }}>
              <InputLabel id="demo-multiple-name-label">
                <strong>Payment Method</strong>
              </InputLabel>
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
            <FormControl sx={{ width: "274px" }}>
              <InputLabel id="demo-multiple-name-label">
                <strong>Users</strong>
              </InputLabel>
              <Select
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                multiple
                onChange={handleChange}
                renderValue={(selected) => selected.join(", ")}
                input={<OutlinedInput label="Users" />}
                defaultValue={["All Users"]}
                value={users}
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
          <Stack direction="row" spacing="2">
            <FormControlLabel
              control={
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DesktopDateTimePicker />
                  {/* <DateTimePicker disableFuture openTo="hours"/> */}
                  {/* <DateTimePicker
            label={<strong>From</strong>}
            views={['year', 'month', 'day', 'hours', 'minutes']}
            // slotProps={{
            //   textField: {
            //     helperText: "Select a from date time",
            //   },
            // }}
          /> */}
                </LocalizationProvider>
              }
              label={<strong>From</strong>}
            />
            <FormControlLabel
              control={
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DesktopDateTimePicker />
                  {/* <DateTimePicker disableFuture openTo="hours"/> */}
                  {/* <DateTimePicker
            label={<strong>From</strong>}
            views={['year', 'month', 'day', 'hours', 'minutes']}
            // slotProps={{
            //   textField: {
            //     helperText: "Select a from date time",
            //   },
            // }}
          /> */}
                </LocalizationProvider>
              }
              label={<strong>To</strong>}
            />
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
