import { Router } from "express";
import fishhealthController from "../../controllers/Fishhealth/index";
const router = Router();

router.get("/", fishhealthController.show);
router.get("/:id", fishhealthController.showById);
router.post("/add", fishhealthController.add);
router.get("/edit/:id", fishhealthController.edit);
router.post("/update/:id", fishhealthController.update);
router.post("/delete/:id", fishhealthController.delete);

export default router;
