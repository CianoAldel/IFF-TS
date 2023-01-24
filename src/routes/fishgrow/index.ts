import { Router } from "express";
import fishgrowController from "../../controllers/Fishgrow/index";
const router = Router();

router.get("/", fishgrowController.show);
router.get("/:id", fishgrowController.showById);
router.post("/add", fishgrowController.add);
router.get("/edit/:id", fishgrowController.edit);
router.post("/update/:id", fishgrowController.update);
router.post("/delete/:id", fishgrowController.delete);

export default router;
