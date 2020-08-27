import { createLogger, format, transports } from 'winston';

// Configure the Winston logger.
// For the complete documentation see https://github.com/winstonjs/winston
const logger = createLogger({
  level: 'http',
  format: format.combine(format.splat(), format.simple()),
  transports: [new transports.Console()],
});

export default logger;
