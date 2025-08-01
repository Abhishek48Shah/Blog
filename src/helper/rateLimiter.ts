import rateLimit from "express-rate-limit";

export default (time: number, hit: number, customMessage?: string) => {
  return rateLimit({
    windowMs: time,
    max: hit,
    message: customMessage || "To many request, please try again later",
    standardHeaders: true,
  });
};
export const authLimiter = {
  login: (15 * 60 * 1000, 5, "To many login attempts. Try again in 15 minutes"),
  signup: (60 * 60 * 1000, 5, "To many signup attempts, Try again in 1 hrs"),
  logout: (60 * 1000, 10),
};
export const roleLimiters = {
  admin: (60 * 1000, 200),
  writer: (60 * 1000, 100),
  reader: (60 * 1000, 30),
};
