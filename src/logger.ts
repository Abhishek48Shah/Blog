import pino from "pino";
const logger = pino({
  level: "info",
  transport: {
    target: "pino-pretty",
    option: {
      colorize: true,
      translateTime: "SYS:standard",
    },
  },
});
export default logger;
