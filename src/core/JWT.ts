import jwt from "jsonwebtoken";
import { readFile } from "fs/promises";
import { join } from "node:path";
import { promisify } from "node:util";
import { tokenInfo, PRIVATE_KEY_PATH, PUBLIC_KEY_PATH } from "../config.ts";
import {
  InternalError,
  TokenExpiredError,
  BadTokenError,
} from "../core/apiError";
import logger from "./logger";
export class JwtPlayload {
  iss: string;
  aud: string;
  exp: number;
  iat: number;
  sub: object;
  prm?: string;

  constructor(
    iss: string,
    aud: string,
    sub: object,
    validity: number,
    prm?: string,
  ) {
    this.iss = iss;
    this.aud = aud;
    this.sub = sub;
    this.iat = Math.floor(Date.now() / 1000);
    this.exp = this.iat + validity;
    this.prm = prm;
  }
}
const getPublicKey = async () => {
  return await readFile(PUBLIC_KEY_PATH, "utf8");
};
const getPrivateKey = async () => {
  return await readFile(PRIVATE_KEY_PATH, "utf8");
};
export const encode = async (playload: JwtPlayload) => {
  const key = await getPrivateKey();
  if (!key) {
    throw new InternalError("Token generation failure");
  }
  return await promisify(jwt.sign)({ ...playload }, key, {
    algorithm: "RS256",
  });
};
export const validate = async (token: string) => {
  try {
    const key = await getPublicKey();
    return await promisify(jwt.verify)(token, key);
  } catch (err) {
    if (err && err.name === "TokenExpiredError") throw new TokenExpiredError();
    throw new BadTokenError();
    console.log(err.stack);
    return next(err);
  }
};
