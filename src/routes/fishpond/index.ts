import { Router } from "express";
import fishPondController from "../../controllers/Fishpond/index";
const router = Router();

router.get("/label", fishPondController.pond);
router.get("/", fishPondController.show);
router.get("/:id", fishPondController.showById);
router.get("/filter", fishPondController.filter);
router.post("/add", fishPondController.add);
router.get("/edit/:id", fishPondController.edit);
router.post("/update/:id", fishPondController.update);
router.post("/delete/:id", fishPondController.delete);

export default router;
