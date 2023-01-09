import { Router } from "express";
import fishhealthController from "../../controllers/Fishhealth/index";
const router = Router();

router.get("/", fishhealthController.show);
router.post("/add", fishhealthController.add);
router.post("/fish/update/:id", fishhealthController.update);
router.post("/fish/delete/:id", fishhealthController.delete);

export default router;
