import { Router } from "express";
import fishscheduleStockController from "../../controllers/Fishschedulestock/index";

const router = Router();

router.get("/", fishscheduleStockController.show);
router.get("/shcedulesMain", fishscheduleStockController.show);

export default router;
