import categoryController from "../../controllers/Category";
import { Router } from "express";

const router = Router();

router.get("/:type", categoryController.index);
router.post("/", categoryController.store);

export default router;
