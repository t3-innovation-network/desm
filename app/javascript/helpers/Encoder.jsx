import jwt from "jsonwebtoken";
import { JWT_ALGORITHM, JWT_SECRET } from "./Constants";

/**
 * Encodes sensitive information inside an object using JSON Web Token
 *
 * @param {Object} toEncode
 */
export const encode = (toEncode) => {
  return jwt.sign(toEncode, JWT_SECRET, {
    algorithm: JWT_ALGORITHM,
  });
};
