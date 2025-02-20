import { UserEntity } from "@/entity/user.entity";
import { logger } from "@/server";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";

dotenv.config();

let dataSource: DataSource | null = null;

export const initializeDB = async (): Promise<DataSource> => {
  if (!dataSource) {
    dataSource = new DataSource({
      type: "postgres",
      host: process.env.DB_HOST,
      port: +(process.env.DB_PORT ?? 5432),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      schema: process.env.DB_SCHEMA,
      entities: [UserEntity],
    });

    try {
      await dataSource.initialize();
      logger.info("DB Connection has been established successfully.");
    } catch (error) {
      logger.error(`Unable to connect to the database: ${error}`);
      throw error;
    }
  }
  return dataSource;
};

export const getDB = (): DataSource => {
  if (!dataSource) {
    throw new Error("Database has not been initialized. Call initializeDB first.");
  }
  return dataSource;
};
