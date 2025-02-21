import { acl, bodyValidator } from "@/middlewares";
import { Router } from "express";
import { SignInUserDTO, SignUpUserDTO } from "./dtos";
import { getAllUsers, getUser, signInUser, signUpUser } from "./user.controller";

const router: Router = Router();

router.post("/sign-up", bodyValidator(SignUpUserDTO), signUpUser);
router.post("/sign-in", bodyValidator(SignInUserDTO), signInUser);
router.get("/me", acl, getUser);
router.get("/", getAllUsers);

export const userRouter: Router = router;
