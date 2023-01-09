import { Router } from "express";
import fishPondController from "../../controllers/Fishpond/index";
const router = Router();

router.get("/", fishPondController.show);
router.post("/add", fishPondController.add);
router.post("/fish/update/:id", fishPondController.update);
router.post("/fish/delete/:id", fishPondController.delete);

export default router;
