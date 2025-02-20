import type { Request, RequestHandler, Response } from "express";

import { userService } from "@/api/user/userService";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { getRepo } from "@/common/utils/get-repo";
import { UserEntity } from "@/entity/user.entity";

class UserController {
  public getUsers: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await userService.findAll();
    return handleServiceResponse(serviceResponse, res);
  };

  public getUser: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await userService.findById(id);
    return handleServiceResponse(serviceResponse, res);
  };

  public test: RequestHandler = async (req: Request, res: Response) => {
    const userRepository = getRepo(UserEntity);
    return res.status(200).json({data : await userRepository.findAndCount()})
  };
}

export const userController = new UserController();
