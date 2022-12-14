import dashboardController from "../../controllers/Dashboard";
import { Router } from "express";
const router = Router();

router.get("/", dashboardController.index);

export default router;
