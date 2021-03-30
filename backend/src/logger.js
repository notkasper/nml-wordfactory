const { format, createLogger, transports } = require('winston');
const { combine, timestamp, label, printf, errors } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} ${label ? `[${label}] ` : ''}${level}: ${message}`;
});

module.exports = {
  logger: createLogger({
    transports: [
      new transports.Console({
        format: combine(timestamp(), myFormat, errors({ stack: true })),
      }),
    ],
  }),
  customLogger: (customLabel) =>
    createLogger({
      transports: [
        new transports.Console({
          format: combine(
            label({ label: customLabel }),
            timestamp(),
            myFormat,
            errors({ stack: true })
          ),
        }),
      ],
    }),
};
