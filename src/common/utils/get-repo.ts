import type { EntityTarget, Repository, ObjectLiteral } from "typeorm";
import { getDB } from "../../config/db";

export const getRepo = <T extends ObjectLiteral>(target: EntityTarget<T>): Repository<T> => {
    return getDB().getRepository(target);
  };
  