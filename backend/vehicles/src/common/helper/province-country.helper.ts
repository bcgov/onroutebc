export const isCAOrUS = (countryCode: string) => {
  return countryCode === 'CA' || countryCode === 'US' ? true : false;
};

export const getCountryCode = (provinceId: string) => {
  const province = provinceId.split('-');
  return province[0];
};

export const getProvinceCode = (provinceId: string) => {
  const province = provinceId.split('-');
  return isCAOrUS(province[0]) ? province[1] : undefined;
};

export const getProvinceId = (countryCode: string, provinceCode: string) => {
  return countryCode + '-' + (isCAOrUS(countryCode) ? provinceCode : 'XX');
};
