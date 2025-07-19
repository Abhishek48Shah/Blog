import jwt from "jsonwebtoken";
import { tokenInfo } from "../config";
export const generateToken = (id) => {
  return new JwtPlayload(tokenInfo.issure, tokenInfo.validity, id);
};
