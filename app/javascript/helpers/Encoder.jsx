import jwt from 'jsonwebtoken';
import { PRIVATE_KEY } from './Constants';

/**
 * Encodes sensitive information inside an object using JSON Web Token
 *
 * @param {Object} toEncode
 */
export const encode = (toEncode) => {
  return jwt.sign(toEncode, PRIVATE_KEY);
};
