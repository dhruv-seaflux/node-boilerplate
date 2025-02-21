import { EntityTarget, Repository } from "typeorm";
import { getDB } from "../db/db";

export const getRepo = <T>(target: EntityTarget<T>): Repository<T> => {
  return getDB().getRepository(target);
};
