import { getDB } from "@/db/db";
import type { EntityTarget, ObjectLiteral, Repository } from "typeorm";

export const getRepo = <T extends ObjectLiteral>(target: EntityTarget<T>): Repository<T> => {
  return getDB().getRepository(target);
};
