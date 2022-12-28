import db from "../../data-source";
import { Request, Response } from "express";
import { Auctions } from "../../entities/Auctions";
import { Biddings } from "../../entities/Biddings";
import { Users } from "../../entities/Users";
import moment from "moment";

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
    const query = await db
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
      .orderBy("auctions.createdAt", "DESC")
      .getRawAndEntities(); // getMany() depending on your style

    if ((query.entities.length && query.raw.length) == 0) {
      return res.json(query);
    }

    const data = {
      ...query.entities[0],
      biddingCount: query.raw[0].biddingCount as number,
      totalBidding: query.raw[0].totalBidding as number,
    };
    res.json(data);
  },
  update: async (req: Request, res: Response) => {
    const { product_id } = req.params;
    const auctionReqBody: AuctionRequest = req.body;
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
      .innerJoinAndSelect("products.productimages", "productimages")
      .getRawAndEntities();

    if ((query.entities.length && query.raw.length) == 0) return res.status(404).json({ message: "ไม่พบข้อมูล" });

    const data = {
      ...query.entities[0],
      biddingCount: query.raw[0].biddingCount as number,
      totalBidding: query.raw[0].totalBidding as number,
    };

    res.json(data);
  },
  destroy: async (req: Request, res: Response) => {},
  bidding: async (req: Request, res: Response) => {
    const io = req.app.get("io");
    const user = req.user;
    const userActive = await db.getRepository(Users).findOne({
      where: {
        id: user?.id,
        bidder: "true",
      },
    });
    if (!userActive)
      return res.status(401).json({
        message: "คุณไม่มีสิทธิ์ใช้งาน \n กรุณาติดต่อ Admin เพื่อทำการยืนยันตัวตนก่อนประมูล",
      });
    const { id } = req.params;
    const auction = await db.getRepository(Auctions).findOne({
      where: { id: id, status: "true" },
    });

    if (!auction) return res.status(404).json({ message: "ไม่พบข้อมูล" });
    const endDateAuction = moment(auction.endDate).unix();
    // console.log("auction", moment(auction.endDate));

    // console.log("end auction", moment());
    if (endDateAuction < moment().unix()) return res.json({ message: "หมดเวลาการประมูล" });

    const { amount } = req.body;

    // return moment.duration(
    //   Math.max(eventTime - Math.floor(moment().valueOf() / 1000), 0),
    //   "seconds"
    // );
    const endAuction = moment.duration(Math.max(endDateAuction - Math.floor(moment().valueOf() / 1000), 0), "seconds");

    if (endAuction.asSeconds() <= 20) {
      auction.endDate = moment().add(auction.biddingTime, "seconds").format("YYYY-MM-DD HH:mm:ss");
    }

    const biddings = new Biddings();
    biddings.auction_id = auction.id;
    biddings.user_id = 45;
    biddings.bidding = amount;
    biddings.createdAt = new Date();
    biddings.updatedAt = new Date();

    const create = await db.getRepository(Biddings).save(biddings);

    const bidding = await db
      .getRepository(Biddings)
      .createQueryBuilder("biddings")
      .where("biddings.id = :id", { id: create.id })
      .innerJoin("biddings.user", "user")
      .getOne();

    io.to(auction.id).emit(`bidding`, { bidding: bidding });
    await db.getRepository(Auctions).save(auction);

    res.json(auction);
  },
};

export default auctionController;
