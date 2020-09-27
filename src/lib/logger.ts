import { createLogger, format, transports, addColors } from 'winston';

// Configure the Winston logger.
// For the complete documentation see https://github.com/winstonjs/winston

const config = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6,
    ok: 7,
  },
  colors: {
    error: 'bold redBG',
    warn: 'bold yellowBG',
    info: 'bold cyanBG',
    http: 'bold black whiteBG',
    verbose: 'bold blueBG',
    debug: 'bold magentaBG',
    silly: 'bold blackBG',
    ok: 'bold greenBG',
  },
};

addColors(config.colors);

const logger = createLogger({
  levels: config.levels,
  level: 'ok',
  format: format.combine(
    format.colorize({ level: true }),
    format.splat(),
    format.simple()
  ),
  transports: [new transports.Console()],
});

export default logger;
