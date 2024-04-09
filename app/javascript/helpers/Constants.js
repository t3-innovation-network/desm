/**
 * The maximum weight value for an aligment to take in a mapping.
 * This mapping involves a spine property (an organization uploaded a specification that
 * becomes the spine), and a mapped property from a second organization, thus the name
 * "..._PER_ORGANIZATION"
 */
export const MAX_MAPPING_WEIGHT_PER_ORGANIZATION = 5;
/**
 * Base URL of the api to make calls to endpoints
 */
// TODO: check if it'll work the same way if to move from webpacker
export const APP_DOMAIN = process.env.APP_DOMAIN; // eslint-disable-line no-undef
/**
 * JWT variables to encode/decode secret values
 */
// TODO: check if it'll work the same way if to move from webpacker
export const PRIVATE_KEY = process.env.PRIVATE_KEY; // eslint-disable-line no-undef

export const TOASTR_OPTIONS = {
  default: {
    timeOut: 5000,
  },
  error: {
    removeOnHover: false,
    removeOnHoverTimeOut: 0,
    timeOut: 0,
  },
};
