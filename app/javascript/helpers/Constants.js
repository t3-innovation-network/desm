/**
 * The algorithm used to encode sensitive information with JWT.
 * E.g. 'HS256', 'RS256'.
 */
export const JWT_ALGORITHM = process.env.JWT_ALGORITHM || "HS256";
/**
 * Secret key to encode passwords and sensitive information.
 */
export const JWT_SECRET = process.env.JWT_SECRET || "mt8yib9hRyzrLH";
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
export const API_URL = process.env.API_URL;
