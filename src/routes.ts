import { Router } from "express";
import { miscRouter } from "./modules/misc";
import { userRouter } from "./modules/user";

export const configureRoutes = () => {
  const router = Router();

  router.get("/health-check", (_, res) => {
    res.status(200).json({ status: "OK" });
  });

  // Register all routes here
  router.use("/misc", miscRouter);
  router.use("/users", userRouter);

  // Handle 404
  router.all("/*", (_, res) =>
    res.status(404).json({
      error: "Requested URL not found!",
    }),
  );

  return router;
};
