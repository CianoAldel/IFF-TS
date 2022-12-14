import userController from "../../controllers/User";
import { Router } from "express";
const router = Router();

router.put(`/`, userController.update);

router.get("/address", userController.address.index);
router.post("/address", userController.address.create);
router.put("/address", userController.address.update);
router.delete("/address", userController.address.delete);
router.get("/auction/:winner?", userController.auction.index);

export default router;
