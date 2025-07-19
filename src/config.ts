import dotenv from "dotenv";
export const redis_URL = process.env.REDIS_URL;
export const tokenInfo = {
  issuer: process.env.TOKEN_ISSUER,
  audience: process.env.TOKEN_AUDIENCE,
  validity: process.env.TOKEN_VALIDITY_TIME,
};
