import auctionController from "../../controllers/Auction";
import { Router } from "express";
const router = Router();

router.get("/", auctionController.index);
router.get("/:id", auctionController.show);
router.get("/:product_id", auctionController.update);
router.get("/", auctionController.destroy);
router.get("/:id/bid", auctionController.bidding);

export default router;
