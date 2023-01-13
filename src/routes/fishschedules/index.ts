import { Router } from "express";
import fishschedulesController from "../../controllers/Fishschedules/index";

const router = Router();

router.get("/", fishschedulesController.show);
router.post("/add", fishschedulesController.add);
router.post("/schedules/:id", fishschedulesController.schedules);
router.get("/betweenManageDate", fishschedulesController.showBetweenManage);

router.post("/edit/:id", fishschedulesController.edit);
router.post("/update/:id", fishschedulesController.update);
router.post("/delete/:id", fishschedulesController.delete);

export default router;
