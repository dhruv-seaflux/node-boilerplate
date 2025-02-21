import { initializeDB } from "@/db/db";
import { app, envs, logger } from "@/server";

const startServer = async () => {
  try {
    await initializeDB();
    logger.info("Database initialized, starting server...");

    const server = app.listen(envs.port, () => {
      const { nodeEnviornment, port } = envs;
      logger.info(`Server (${nodeEnviornment}) running on port http://localhost:${port}`);
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
