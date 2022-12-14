import testController from "../../controllers/Test";
import { Router } from "express";
const router = Router();

router.get("/", testController.index);

export default router;
