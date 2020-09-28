import { stripIndent } from 'common-tags';
import { createLogger, format, transports, addColors } from 'winston';
import { isEmptyObject } from 'lib/utils';

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

const rest = (info: Record<string, unknown>) => {
  if (isEmptyObject(info)) {
    return '';
  }

  return JSON.stringify(
    {
      ...info,
      level: undefined,
      message: undefined,
      splat: undefined,
      label: undefined,
    },
    null,
    2
  );
};

const customFormat = format.printf(
  ({ level, message, timestamp, ...meta }) =>
    stripIndent`
      ${timestamp} [${level}] - ${message}
      ${rest(meta)}
    `
);

addColors(config.colors);

const logger = createLogger({
  levels: config.levels,
  level: 'ok',
  format: format.combine(
    format.colorize({ level: true }),
    format.timestamp(),
    format.errors({ stack: true }),
    format.splat(),
    customFormat
  ),
  transports: [new transports.Console({ handleExceptions: true })],
});

export default logger;
