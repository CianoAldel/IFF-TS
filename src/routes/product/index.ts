import productController from "../../controllers/Product";
import { Router } from "express";
const router = Router();

router.get("/", productController.index);

export default router;
