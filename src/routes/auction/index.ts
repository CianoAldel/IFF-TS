import auctionController from "../../controllers/Auction";
import { Router } from "express";
import auctionStatusController from "../../controllers/Auction/status";
import auth from "../../middlewares/passport-auth";
const router = Router();

router.get("/", auctionController.index);
router.get("/:id", auctionController.show);
router.get("/:product_id", auctionController.update);
router.get("/", auctionController.destroy);
router.post("/:product_id/status", auth, auctionStatusController.index);
router.post("/:id/bid", auctionController.bidding);

export default router;
