import serviceController from "../../controllers/Service";
import { Router } from "express";
const router = Router();

router.get("/", serviceController.index);

export default router;
