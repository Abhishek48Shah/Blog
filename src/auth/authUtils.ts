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
  return authorization.split(" ")[1];
};
export const getRefreshToken = (cookie: JwtPalyload) => {
  if (!cookie.startsWith("refreshToken"))
    throw new AuthFailureError("Invalid Authorization");
  if (!cookie.split("=")[1])
    throw new AuthFailureError("Invalid Authorization");
  return cookie.split("=")[1];
};
export const createToken = async (user, accessTokenHex, refreshTokenHex) => {
  const accessToken = await encode(
    new JwtPlayload(
      tokenInfo.issuer,
      tokenInfo.audience,
      user,
      accessTokenHex,
      tokenInfo.accessValidity,
    ),
  );
  const refreshToken = await encode(
    new JwtPlayload(
      tokenInfo.issuer,
      tokenInfo.audience,
      user,
      refreshTokenHex,
      tokenInfo.refreshValidity,
    ),
  );
  return { accessToken: accessToken, refreshToken: refreshToken };
};
export const tokenVerification = (playload) => {
  if (
    !playload.iss ||
    !playload.aud ||
    !playload.exp ||
    !playload.iat ||
    !playload.sub ||
    !playload.prm ||
    playload.iss !== tokenInfo.issuer ||
    playload.aud !== tokenInfo.audience
  ) {
    throw new AuthFailureError();
  }
  return true;
};
