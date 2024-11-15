import winston from "winston";

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};

const level = () => {
  const env = process.env.NODE_ENV || "development";
  return env === "development" ? "debug" : "warn";
};

const emojis = {
  error: "\x1b[31m❌\x1b[0m",
  warn: "\x1b[33m⚠️\x1b[0m",
  info: "\x1b[32m💡\x1b[0m",
  http: "\x1b[35m🌐\x1b[0m",
  debug: "\x1b[37m🐛\x1b[0m"
};

const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white"
};

winston.addColors(colors);

// Formato personalizzato per il logger
const customFormat = winston.format.printf(
  ({ level: logLevel, message, timestamp }) => {
    const emoji = emojis[logLevel.toLowerCase()];

    if (typeof message === "object") {
      return `${timestamp} ${emoji} [${logLevel.toUpperCase()}]: ${JSON.stringify(message, null, 2)}`;
    }

    return `${timestamp} ${emoji} [${logLevel.toUpperCase()}]: ${message}`;
  }
);

const format = winston.format.combine(
  winston.format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss:SSS"
  }),
  customFormat
);

const transports = [
  new winston.transports.Console({
    format: format
  }),
  new winston.transports.File({
    filename: "logs/error.log",
    level: "error"
  }),
  new winston.transports.File({
    filename: "logs/all.log"
  })
];

const Logger = winston.createLogger({
  level: level(),
  levels,
  transports
});

export default Logger;
