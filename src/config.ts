import dotenv from "dotenv";
export const redis_URL = process.env.REDIS_URL;
export const tokenInfo = {
  issuer: process.env.TOKEN_ISSUER || "",
  audience: process.env.TOKEN_AUDIENCE || "",
  refreshValidity: parseInt(process.env.REFRESH_TOKEN_VALIDITY_TIME || "0"),
  accessValidity: parseInt(process.env.ACCESS_TOKEN_VALIDITY_TIME || "0"),
};
export const PRIVATE_KEY_PATH =
  process.env.PRIVATE_KEY_PATH || "/app/keys/private.pem";
export const PUBLIC_KEY_PATH =
  process.env.PUBLIC_KEY_PATH || "app/keys/public.pem";
