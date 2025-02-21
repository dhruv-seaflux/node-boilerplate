import { withRoutes } from "@/helpers";
import { Router } from "express";
import { getEnums } from "./misc.controller";

const router: Router = Router();

router.get("/enums", getEnums);

export const miscRouter: Router = router;
