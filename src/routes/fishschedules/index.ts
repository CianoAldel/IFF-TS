import { Router } from "express";
import fishschedulesController from "../../controllers/Fishschedules/index";

const router = Router();

router.get("/", fishschedulesController.show);
router.post("/add", fishschedulesController.add);
router.post("/fish/update/:id", fishschedulesController.update);
router.post("/fish/delete/:id", fishschedulesController.delete);

export default router;
