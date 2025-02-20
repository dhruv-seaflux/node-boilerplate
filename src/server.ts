import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { pino } from "pino";

import { openAPIRouter } from "@/api-docs/openAPIRouter";
import { healthCheckRouter } from "@/api/healthCheck/healthCheckRouter";
import { userRouter } from "@/api/user/userRouter";
import errorHandler from "@/common/middleware/errorHandler";
import rateLimiter from "@/common/middleware/rateLimiter";
import requestLogger from "@/common/middleware/requestLogger";
import { env } from "@/common/utils/envConfig";
import { initializeDB } from "./config/db";
import "reflect-metadata"

const logger = pino({ name: "server start" });
const app: Express = express();

// Set the application to trust the reverse proxy
app.set("trust proxy", true);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(rateLimiter);

// Request logging
app.use(requestLogger);

// DB Initialization
const startServer = async () => {
  try {
    await initializeDB();
    logger.info("Database initialized, starting server...");

    // Routes
    app.use("/health-check", healthCheckRouter);
    app.use("/users", userRouter);

    // Swagger UI
    app.use(openAPIRouter);

    // Error handlers
    app.use(errorHandler());
  } catch (error) {
    logger.error("Failed to initialize database", error);
    process.exit(1);
  }
};

startServer();

export { app, logger };