export const isCAOrUA = (countryCode: string) => {
  return countryCode === 'CA' || countryCode === 'US' ? true : false;
};

export const getCountryCode = (provinceId: string) => {
  const province = provinceId.split('-');
  return province[0];
};

export const getProvinceCode = (provinceId: string) => {
  const province = provinceId.split('-');
  return isCAOrUA(province[0]) ? province[1] : undefined;
};

export const getProvinceId = (countryCode: string, provinceCode: string) => {
  return countryCode + '-' + (isCAOrUA(countryCode) ? provinceCode : 'XX');
};
