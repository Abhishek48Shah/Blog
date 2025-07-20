import { tokenInfo } from "../config.ts";
import { JwtPlayload, encode } from "../core/JWT.ts";
export const generateToken = (id) => {
  return new JwtPlayload(tokenInfo.issure, tokenInfo.validity, id);
};
export const createToken = async (user, accessTokenHex, refreshTokenHex) => {
  const accessToken = await encode(
    new JwtPlayload(
      tokenInfo.issure,
      tokenInfo.audience,
      user,
      accessTokenHex,
      tokenInfo.accessValidity,
    ),
  );
  const refreshToken = await encode(
    new JwtPlayload(
      tokenInfo.issure,
      tokenInfo.audience,
      user,
      refreshTokenHex,
      tokenInfo.refreshValidity,
    ),
  );
  return { accessToken: accessToken, refreshToken: refreshToken };
};
