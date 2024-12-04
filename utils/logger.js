import winston from "winston";
import colors from "colors";

/**
 * Custom logging levels
 * @constant {Object}
 * @property {number} error - Level 0: Critical errors that need immediate attention
 * @property {number} warn - Level 1: Warning messages for potential issues
 * @property {number} info - Level 2: General information about application operation
 * @property {number} http - Level 3: HTTP request-specific information
 * @property {number} debug - Level 4: Detailed debugging information
 */
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

/**
 * Determines the logging level based on environment
 * @function level
 * @returns {string} Logging level ('debug' for development, 'warn' for production)
 */
const level = () => {
  const env = process.env.NODE_ENV || "development";
  return env === "development" ? "debug" : "warn";
};

// Configure colors theme
colors.setTheme({
  error: "red",
  warn: "yellow",
  info: "blue",
  http: "magenta",
  debug: "white",
});

/**
 * Emoji indicators for different log levels
 * @constant {Object}
 */
const emojis = {
  error: "❌",
  warn: "⚠️",
  info: "💡",
  http: "🌐",
  debug: "🐛",
};

/**
 * Custom format for log messages
 * @function customFormat
 * @param {Object} info - Log information object
 * @param {string} info.level - Log level
 * @param {string|Object} info.message - Log message
 * @param {string} info.timestamp - Timestamp of the log
 * @returns {string} Formatted log message
 */
const customFormat = winston.format.printf(({ level, message, timestamp }) => {
  const emoji = emojis[level.toLowerCase()];
  const colorizedLevel = colors[level.toLowerCase()](
    `[${level.toUpperCase()}]`
  );
  const colorizedMessage = colors[level.toLowerCase()](message);

  if (typeof message === "object") {
    return `${timestamp} ${emoji} ${colorizedLevel}: ${JSON.stringify(
      message,
      null,
      2
    )}`;
  }

  return `${timestamp} ${emoji} ${colorizedLevel}: ${colorizedMessage}`;
});

/**
 * Combined format including timestamp and custom formatting
 * @constant {winston.Logform.Format}
 */
const format = winston.format.combine(
  winston.format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss:SSS",
  }),
  customFormat
);

/**
 * Array of transport configurations for winston
 * @constant {Array<winston.transport>}
 */
const transports = [
  new winston.transports.Console({
    format: format,
  }),
  new winston.transports.File({
    filename: "logs/error.log",
    level: "error",
  }),
  new winston.transports.File({
    filename: "logs/all.log",
  }),
];

/**
 * Configured winston logger instance
 * @constant {winston.Logger}
 * @example
 * // Usage in other files:
 * import Logger from '#utils/logger.js';
 * Logger.info('Operation successful');
 * Logger.error('An error occurred');
 */
const Logger = winston.createLogger({
  level: level(),
  levels,
  transports,
});

export default Logger;
