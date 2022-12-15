import categoryController from "../../controllers/Category";
import { Router } from "express";
import auth from "../../middlewares/auth";

const router = Router();

router.get("/:type", auth, categoryController.index);
router.get("/", categoryController.store);

export default router;
