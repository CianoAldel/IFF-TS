import { Router } from "express";
import fishgrowController from "../../controllers/Fishgrow/index";
const router = Router();

router.get("/:id", fishgrowController.show);
router.post("/add", fishgrowController.add);
router.post("/fish/update/:id", fishgrowController.update);
router.post("/fish/delete/:id", fishgrowController.delete);

export default router;
