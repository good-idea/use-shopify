import Cookies from 'js-cookie'

export const VIEWER_CART_TOKEN = '_shopify_cart'
export const VIEWER_ACCESS_TOKEN = '_shopify_viewer'
export const VIEWER_EMAIL = '_shopify_viewer_email'

interface CookieConfig {
  expires?: number
  path?: string
}

export const setCookie = (key: string, val: any, config?: CookieConfig) => {
  if (val === undefined) return
  const defaults = {
    expires: 7,
    path: '/',
  }
  const settings = {
    ...defaults,
    ...config,
  }
  const stringified = JSON.stringify(val)
  Cookies.set(key, stringified, settings)
}

export const getCookie = <ExpectedResult>(
  key: string,
): ExpectedResult | null => {
  const value = Cookies.get(key)
  if (value) return JSON.parse(value)
  return null
}

export const removeCookie = (key: string) => {
  Cookies.remove(key)
}

export const persistData = (
  key: string,
  val: any,
  forceCookie: boolean,
): void => {
  const value = JSON.stringify(val)
  if (window.localStorage !== null && forceCookie !== true) {
    window.localStorage.setItem(key, value)
  } else {
    Cookies.set(key, value)
  }
}

export const retrieveData = <ExpectedResult>(
  key: string,
  forceCookie: boolean,
): ExpectedResult | null => {
  const value =
    window.localStorage !== null && forceCookie !== true
      ? window.localStorage.getItem(key)
      : Cookies.get(key)
  if (value) return JSON.parse(value)
  return null
}

// export const removeData = (key: string, forceCookie: boolean): mixed => {};
