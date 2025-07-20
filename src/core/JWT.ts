import jwt from "jsonwebtoken";
import { readFile } from "fs/promises";
import { join } from "node:path";
import { tokenInfo } from "../config.ts";
//import { InternalError } from "../core/apiError";
export class JwtPlayload {
  iss: string;
  aud: string;
  exp: number;
  iat: number;
  sub: number;
  prm: string;

  constructor(iss, aud, sub, prm, validity) {
    this.iss = iss;
    this.aud = aud;
    this.sub = sub;
    this.prm = prm;
    this.iat = Math.floor(Date.now() / 1000);
    this.exp = this.iat + validity;
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
export const encode = async (playload: JwtPlayload) => {
  const key = await getPrivateKey();
  if (!key) {
    //  throw new InternalError("Token generation failure");
    console.log("No key find bitch!");
  }
  return await jwt.sign({ ...playload }, key, {
    algorithm: "RS256",
  });
};
