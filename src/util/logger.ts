import winston from "winston";
import { Logger, createLogger } from "winston";
import { ENVIRONMENT } from "./secrets";

// const logger = new ((Logger))({
//     transports: [
//         new (winston.transports.Console)({ level: process.env.NODE_ENV === "production" ? "error" : "debug" }),
//         new (winston.transports.File)({ filename: "debug.log", level: "debug"})
//     ]
// });

const loggerOptions: winston.LoggerOptions = {
    transports: [
        new (winston.transports.Console)({ level: process.env.NODE_ENV === "production" ? "error" : "debug" }),
        new (winston.transports.File)({ filename: "debug.log", level: "debug" })
    ]
};

const logger: Logger = createLogger(loggerOptions);


if (process.env.NODE_ENV !== "production") {
    logger.debug("Logging initialized at debug level");
}

export default logger;

