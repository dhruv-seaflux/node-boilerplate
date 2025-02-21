import { UserEntity } from "@/db/entities";
import { decode, getRepo } from "@/helpers";
import { TRequest, TResponse } from "@/types";

export const acl = async (req: TRequest, res: TResponse, next: () => void) => {
  const tokenInfo = decode<any>(req.headers.authorization?.replace("Bearer ", ""));

  if (!tokenInfo) {
    return res.status(401).send({ code: 401, reason: "Unauthorized!" });
  }
  const userRepository = getRepo(UserEntity);
  const user = await userRepository.findOne({
    where: { id: tokenInfo.id },
  });
  if (!user) {
    return res.status(401).send({ code: 401, reason: "Unauthorized!" });
  }
  req.me = user;
  return next();
};
