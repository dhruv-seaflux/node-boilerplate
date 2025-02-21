import { env } from "@/common/utils/envConfig";
import { initializeDB } from "@/config/db";
import { app, logger } from "@/server";

const startServer = async () => {
  try {
    await initializeDB();
    logger.info("Database initialized, starting server...");

    const server = app.listen(env.PORT, () => {
      const { NODE_ENV, HOST, PORT } = env;
      logger.info(`Server (${NODE_ENV}) running on port http://${HOST}:${PORT}`);
    });

    const onCloseSignal = () => {
      logger.info("SIGINT received, shutting down");
      server.close(() => {
        logger.info("Server closed");
        process.exit();
      });
      setTimeout(() => process.exit(1), 10000).unref(); // Force shutdown after 10s
    };

    process.on("SIGINT", onCloseSignal);
    process.on("SIGTERM", onCloseSignal);
  } catch (error) {
    logger.error("Failed to initialize database", error);
    process.exit(1);
  }
};

startServer();
