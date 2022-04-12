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
export const APP_DOMAIN = process.env.APP_DOMAIN;
/**
 * JWT variables to encode/decode secret values
 */
export const PRIVATE_KEY = process.env.PRIVATE_KEY;
