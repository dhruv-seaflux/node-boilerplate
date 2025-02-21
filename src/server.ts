import express, { type Express } from "express";
import helmet from "helmet";
import { pino } from "pino";

import errorHandler from "@/common/middleware/errorHandler";
import "reflect-metadata";
import { enableCors, envValidator } from "@/helpers";
import morgan from "morgan";
import { configureRoutes } from "./routes";

const logger = pino({ name: "server start" });
export const envs = envValidator();

const app: Express = express();

// Set the application to trust the reverse proxy
app.set("trust proxy", true);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan("tiny"));

enableCors(app);

// Routing
app.use("/", configureRoutes());

// Error handlers
app.use(errorHandler());

export { app, logger };
