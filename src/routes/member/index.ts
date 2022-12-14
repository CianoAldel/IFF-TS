import userController from "../../controllers/User";
import { Router } from "express";
const router = Router();

router.get("/", userController.index);

export default router;
