type CountryCode = string

export interface MailingAddress {
  address1: string
  address2: string
  city: string
  country: string
  countryCodeV2: CountryCode
  firstName: string
  formatted: string[]
  formattedArea: string
  id: string
  lastName: string
  latitude: number
  longitude: number
  name: string
  phone: string
  provice: string
  provinceCOde: string
  zip: string
}
