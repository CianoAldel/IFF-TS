import { Router } from "express";
import fishschedulesController from "../../controllers/Fishschedules/index";

const router = Router();

router.get("/", fishschedulesController.show);
router.get("/getLogById", fishschedulesController.logSchedulesRepeat);
router.get("/getLogs", fishschedulesController.logs);
router.post("/add", fishschedulesController.add);
router.get("/get", fishschedulesController.get);
router.get("/getById", fishschedulesController.getById);

//fish schedules add event status and get event status
router.post("/addEventstatus", fishschedulesController.addEventStatus);
router.get("/getEventstatus", fishschedulesController.getEventStatus);

router.post("/schedulesTest", fishschedulesController.schedulesTest);
router.get("/betweenManageDate", fishschedulesController.showBetweenManage);

router.post("/edit/:id", fishschedulesController.edit);
router.post("/update/:id", fishschedulesController.update);
router.post("/delete/:id", fishschedulesController.delete);

export default router;
