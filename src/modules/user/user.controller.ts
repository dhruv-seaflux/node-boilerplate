import { UserEntity } from "@/db/entities";
import { encode, getRepo, hashPassword, verifyPassword } from "@/helpers";
import type { TRequest, TResponse } from "@/types";
import type { TSignInUserDTO, TSignUpUserDTO } from "./dtos";

export async function signUpUser(req: TRequest<TSignUpUserDTO>, res: TResponse) {
  const { name, email, password } = req.dto;
  const userRepository = getRepo(UserEntity);

  const hasedPassword = await hashPassword(password);

  const user = userRepository.create({
    name,
    email,
    password: hasedPassword,
  });

  await userRepository.save(user);

  const token = encode({ id: user.id });

  const createdUser = await userRepository.findOne({
    where: { email },
    select: ["id", "name", "email"],
  });

  return res.status(200).json({ data: { ...createdUser, token } });
}

export async function signInUser(req: TRequest<TSignInUserDTO>, res: TResponse) {
  const { email, password } = req.dto;
  const userRepository = getRepo(UserEntity);

  const user = await userRepository.findOne({
    where: { email },
  });

  if (!user) {
    return res.status(400).json({ error: "Please verify email account!" });
  }

  const compare = await verifyPassword(password, user.password);

  if (!compare) {
    return res.status(400).json({ error: "Please check your password!" });
  }

  const token = encode({ id: user.id });

  return res.status(200).json({ data: { id: user.id, name: user.name, email: user.email, token } });
}

export async function test(_: TRequest, res: TResponse) {
  const userRepository = getRepo(UserEntity);

  return res.status(200).json({ data: await userRepository.find() });
}

export async function getUser(req: TRequest, res: TResponse) {
  const { id, name, email } = req.me;
  res.status(200).json({
    data: {
      id,
      name,
      email,
    },
  });
}
