type PermitMailingAddress = {
  addressLine1: string
  addressLine2?: string | null
  city: string
  provinceCode: string
  countryCode: string
  postalCode: string
}

type PermitContactDetails = {
  firstName: string
  lastName: string
  phone1: string
  phone1Extension?: string | null
  phone2?: string | null
  phone2Extension?: string | null
  email: string
  additionalEmail?: string | null
  fax?: string | null
}

type PermitVehicleDetails = {
  vehicleId?: string | null
  unitNumber?: string | null
  vin: string
  plate: string
  make?: string | null
  year?: number | null
  countryCode: string
  provinceCode: string
  vehicleType: string
  vehicleSubType: string
  saveVehicle?: boolean | null
}

type PermitCommodity = {
  description: string
  condition: string
  conditionLink: string
  checked: boolean
  disabled: boolean
}

type PermitData = {
  companyName: string
  clientNumber: string
  permitDuration: number
  commodities: Array<PermitCommodity>
  contactDetails: PermitContactDetails
  mailingAddress: PermitMailingAddress
  vehicleDetails: PermitVehicleDetails
  feeSummary?: string | null
  startDate: string
  expiryDate?: string | null
}

type PermitApplication = {
  permitData: PermitData
  permitType: string
}

export default PermitApplication;