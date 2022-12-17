import db from "../../data-source";
import { Request, Response } from "express";
import { Auctions } from "../../entities/Auctions";
import { Biddings } from "../../entities/Biddings";

interface AuctionRequest {
  biddingTime: number;
  endAuctionDate: string;
  id: string;
  minBiddingPrice: number;
  startAuctionDate: string;
  startPrice: number;
}

const auctionController = {
  index: async (req: Request, res: Response) => {
    const query = db
      .getRepository(Auctions)
      .createQueryBuilder("auctions")
      .where("auctions.status = :status", { status: true })
      .select([
        "auctions.biddingTime",
        "auctions.createdAt",
        "auctions.endDate",
        "auctions.endOfAuction",
        "auctions.id",
        "auctions.minBid",
        "auctions.startDate",
        "auctions.startPrice",
        "auctions.status",
      ])
      .innerJoin("auctions.products", "products")
      .innerJoin("products.productimages", "productimages")
      .addSelect((subquery) => {
        return subquery.from(Biddings, "biddings").select("COUNT(*)").where(`auctions.id = biddings.auction_id`);
      }, "biddingCount")
      .addSelect((subquery) => {
        return subquery.from(Biddings, "biddings").select("SUM(bidding)").where(`auctions.id = biddings.auction_id`);
      }, "totalBidding")
      .orderBy("auctions.createdAt", "DESC");

    const result = await query.getRawMany(); // getMany() depending on your style

    res.json(result);
  },
  update: async (req: Request, res: Response) => {
    const { product_id } = req.params;
    const auctionReqBody: AuctionRequest = req.body;
    // console.log(auctionReqBody);

    const auction = await db.getRepository(Auctions).findOne({
      where: [
        {
          product_id: Number(product_id),
          id: auctionReqBody.id,
        },
      ],
    });

    if (!auction) return res.status(404).json({ message: "ไม่พบข้อมูล" });

    auction.biddingTime = auctionReqBody.biddingTime;
    auction.startPrice = auctionReqBody.startPrice;
    auction.startDate = auctionReqBody.startAuctionDate;
    auction.endDate = auctionReqBody.endAuctionDate;
    auction.minBid = auctionReqBody.minBiddingPrice;

    await db.getRepository(Auctions).save(auction);

    res.json(auction);
  },
  show: async (req: Request, res: Response) => {
    const { id } = req.params;

    const query = await db
      .getRepository(Auctions)
      .createQueryBuilder("auctions")
      .where("auctions.id = :id", { id: id })
      .select([
        "auctions.biddingTime",
        "auctions.createdAt",
        "auctions.endDate",
        "auctions.endOfAuction",
        "auctions.id",
        "auctions.minBid",
        "auctions.startDate",
        "auctions.startPrice",
        "auctions.status",
      ])
      .addSelect((subquery) => {
        return subquery.from(Biddings, "biddings").select("COUNT(*)").where(`auctions.id = biddings.auction_id`);
      }, "biddingCount")
      .addSelect((subquery) => {
        return subquery.from(Biddings, "biddings").select("SUM(bidding)").where(`auctions.id = biddings.auction_id`);
      }, "totalBidding")
      .innerJoinAndSelect("auctions.products", "products")
      .innerJoinAndSelect("products.productimages", "productimages");

    if (!query) return res.status(404).json({ message: "ไม่พบข้อมูล" });

    res.json(query);
  },
  destroy: async (req: Request, res: Response) => {},
};

export default auctionController;
