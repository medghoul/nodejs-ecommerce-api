import winston from 'winston';
import colors from 'colors';

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

const level = () => {
    const env = process.env.NODE_ENV || 'development';
    return env === 'development' ? 'debug' : 'warn';
};

// Configure colors theme
colors.setTheme({
    error: 'red',
    warn: 'yellow',
    info: 'blue',
    http: 'magenta',
    debug: 'white'
});

const emojis = {
    error: '❌',
    warn: '⚠️',
    info: '💡',
    http: '🌐',
    debug: '🐛',
};

// Custom format for the logger
const customFormat = winston.format.printf(({ level, message, timestamp }) => {
    const emoji = emojis[level.toLowerCase()];
    const colorizedLevel = colors[level.toLowerCase()](`[${level.toUpperCase()}]`);
    const colorizedMessage = colors[level.toLowerCase()](message);
    
    if (typeof message === 'object') {
        return `${timestamp} ${emoji} ${colorizedLevel}: ${JSON.stringify(message, null, 2)}`;
    }
    
    return `${timestamp} ${emoji} ${colorizedLevel}: ${colorizedMessage}`;
});

const format = winston.format.combine(
    winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss:SSS'
    }),
    customFormat
);

const transports = [
    new winston.transports.Console({
        format: format
    }),
    new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
    }),
    new winston.transports.File({
        filename: 'logs/all.log'
    })
];

const Logger = winston.createLogger({
    level: level(),
    levels,
    transports
});

export default Logger;
