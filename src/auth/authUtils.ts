import { tokenInfo } from "../config.ts";
import { JwtPlayload, encode } from "../core/JWT.ts";
import { AuthFailureError } from "../core/apiError";
export const generateToken = (id) => {
  return new JwtPlayload(tokenInfo.issure, tokenInfo.validity, id);
};
export const getAccessToken = (authorization: JwtPlayload) => {
  if (!authorization) throw new AuthFailureError("Invalid Authorization");
  if (!authorization.startsWith("Bearer"))
    throw new AuthFailureError("Invalid Authorization");
  const value = authorization.split(" ")[1];
  return value;
};
export const getRefreshToken = (cookie: JwtPalyload) => {
  if (!cookie.startsWith("refreshToken"))
    throw new AuthFailureError("Invalid Authorization");
  if (!cookie.split("=")[1])
    throw new AuthFailureError("Invalid Authorization");
  return cookie.split("=")[1];
};
export const createToken = async (user, refreshTokenHex) => {
  const accessToken = await encode(
    new JwtPlayload(
      tokenInfo.issuer,
      tokenInfo.audience,
      user,
      tokenInfo.accessValidity,
    ),
  );
  const refreshToken = await encode(
    new JwtPlayload(
      tokenInfo.issuer,
      tokenInfo.audience,
      user,
      tokenInfo.refreshValidity,
      refreshTokenHex,
    ),
  );
  return { accessToken: accessToken, refreshToken: refreshToken };
};
export const tokenVerification = (payload, isRefresh = false) => {
  if (
    !payload.iss ||
    !payload.aud ||
    !payload.exp ||
    !payload.iat ||
    !payload.sub ||
    payload.iss !== tokenInfo.issuer ||
    payload.aud !== tokenInfo.audience
  ) {
    throw new AuthFailureError();
  }
  if (isRefresh && !payload.prm) {
    throw new AuthFailureError();
  }
  return true;
};
