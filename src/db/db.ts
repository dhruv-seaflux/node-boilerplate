import { UserEntity } from "@/db/entities";
import { envs, logger } from "@/server";
import { DataSource } from "typeorm";

let dataSource: DataSource | null = null;

export const initializeDB = async () => {
  if (!dataSource) {
    dataSource = new DataSource({
      type: "postgres",
      host: envs.dbHost,
      port: envs.dbPort,
      username: envs.dbUser,
      password: envs.dbPassword,
      database: envs.dbName,
      schema: envs.dbSchema,
      entities: [UserEntity],
    });

    try {
      await dataSource.initialize();
      logger.info("DB Connection has been established successfully.");
    } catch (error) {
      logger.error(`Unable to connect to the database: ${error}`);
    }
  }

  return dataSource;
};

export const getDB = () => {
  if (!dataSource) {
    throw new Error("Database has not been initialized. Call initializeDB first.");
  }

  return dataSource;
};

export const destroyDB = async () => {
  if (dataSource) {
    await dataSource.destroy();
  }

  return;
};
