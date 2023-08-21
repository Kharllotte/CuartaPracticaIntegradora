import winston from "winston";

const customColors = {
  fatal: "bold red",
  error: "red",
  warning: "yellow",
  info: "green",
  http: "blue",
  debug: "white",
};

const logFormat = winston.format.combine(
  winston.format.colorize({
    all: true,
    colors: customColors,
  }),
  winston.format.printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
  })
);

const logLevels = {
  fatal: 0,
  error: 1,
  warning: 2,
  info: 3,
  http: 4,
  debug: 5,
};

const logger = winston.createLogger({
  levels: logLevels,
  level: "info",
  format: winston.format.combine(winston.format.timestamp(), logFormat),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: "app.log",
      level: "info",
    }),
    new winston.transports.File({
      filename: "errors.log",
      level: "error",
    }),
  ],
});

export default logger;
