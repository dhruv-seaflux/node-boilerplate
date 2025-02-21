import { logger } from "@/server";

export const handleUnhandledPromise = (): void => {
  process
    .on("unhandledRejection", reason => {
      logger.error("Unhandled Promise Rejection");
      logger.error(reason);
    })
    .on("uncaughtException", err => {
      logger.error("Uncaught Exception thrown");
      logger.error(err);
      process.exit(1);
    });
};
