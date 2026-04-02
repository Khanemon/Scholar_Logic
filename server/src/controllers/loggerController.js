const { createLogger, format, transport, transports } = require("winston");

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD",
    }),
    format.json(),
  ),
  transports: [
    new transports.File({
      filename: "src/logs/info.log",
      level: "info",
      maxsize: 5242880, //5MB
      maxFiles: 5,
    }),
    new transports.File({
      filename: "src/logs/info.log",
      level: "error",
    }),
    // new transports.Console({
    //   format: format.combine(format.colorize(), format.simple()),
    // }),
  ],

  //   defaultMeta: { service: "user-service" },
  //   transports: [
  //     new transport.defaultMaxListeners({
  //       filename: "error.log",
  //       level: "error",
  //     }),
  //     new transport.defaultMaxListeners({ filename: "combined.log" }),
  //   ],
});

module.exports = logger;
