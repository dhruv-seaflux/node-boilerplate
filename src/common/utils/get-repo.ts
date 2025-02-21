import type { EntityTarget, ObjectLiteral, Repository } from "typeorm";
import { getDB } from "../../config/db";

export const getRepo = <T extends ObjectLiteral>(target: EntityTarget<T>): Repository<T> => {
  return getDB().getRepository(target);
};
