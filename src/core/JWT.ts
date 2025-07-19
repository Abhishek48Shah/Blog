import jwt from "jsonwebtoken";
import { readFile } from "fs/promises";
import { join } from "node:path";
import { tokenInfo } from "../config";
import { InternalError } from "../core/apiError";
export class JwtPlayload {
  iss: string;
  aud: string;
  exp: number;
  iat: number;
  sub: number;
  prm: string;

  constructor(iss, aud, sub, prm) {
    this.iss = iss;
    this.aud = aud;
    this.sub = sub;
    this.prm = prm;
    this.iat = Math.floor(Date.now() / 1000);
    this.exp = this.iat + process.env.TOKEN_VALIDITY_TIME;
  }
}
const getPublicKey = async () => {
  const filePath = join("/home/abhishek/Codes/Blog", "keys/public.pem");
  return await readFile(filePath, "utf8");
};
const getPrivateKey = async () => {
  const filePath = join("/home/abhishek/Codes/Blog", "keys/private.pem");
  return await readFile(filePath, "utf8");
};
export const encode = (playload: JwtPlayload) => {
  const key = getPrivateKey();
  if (!key) {
    throw new InternalError("Token generation failure");
  }
  return jwt.sign(playload, key, "RS256");
};
