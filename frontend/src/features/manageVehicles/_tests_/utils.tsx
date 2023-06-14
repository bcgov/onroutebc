import user from "@testing-library/user-event";
import { screen } from "@testing-library/react";

// HELPERS
export const clickSubmit = () => {
  user.click(screen.getByRole("button", { name: /Add To Inventory/i }));
};

// HELPERS: Get Fields
export const getUnitNumber = () => {
  return screen.getByRole("textbox", {
    name: /unitNumber/i,
  });
};

export const getMake = () => {
  return screen.getByRole("textbox", {
    name: /make/i,
  });
};

export const getYear = () => {
  // "year" field is now of type="number" (ie. role of "spinbutton")
  return screen.getByRole("spinbutton", {
    name: /year/i,
  });
};

export const getVIN = () => {
  return screen.getByRole("textbox", {
    name: /vin/i,
  });
};

export const getPlate = () => {
  return screen.getByRole("textbox", {
    name: /plate/i,
  });
};

export const getTrailerTypeCode = () => {
  return screen.getByRole("button", {
    name: /trailerTypeCode/i,
  });
};

export const getPowerUnitTypeCode = () => {
  return screen.getByRole("button", {
    name: /powerUnitTypeCode/i,
  });
};

export const getCountry = () => {
  return screen.getByRole("button", {
    name: /countryCode/i,
  });
};

export const getProvince = () => {
  return screen.getByRole("button", {
    name: /provinceCode/i,
  });
};

export const getEmptyTrailerWidth = () => {
  return screen.getByRole("textbox", {
    name: /emptyTrailerWidth/i,
  });
};

export const getLicensedGvw = () => {
  // "licensedGvw" field is now of type="number" (ie. role of "spinbutton")
  return screen.getByRole("spinbutton", {
    name: /licensedGvw/i,
  });
};

export const getSteerAxleTireSize = () => {
  return screen.getByRole("textbox", {
    name: /steerAxleTireSize/i,
  });
};
