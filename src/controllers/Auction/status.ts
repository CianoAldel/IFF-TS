import { Request, Response } from "express";

// import * as utils from "../PaymentController/utils/index";

import db from "../../data-source";
import { Auctions } from "../../entities/Auctions";
const auctionStatusController = {
  index: async (req: Request, res: Response) => {
    const { product_id } = req.params;
    const object: { status: string } = req.body;

    const data = await db.getRepository(Auctions).findOneBy({
      product_id: Number(product_id),
    });

    if (!data) {
      // console.log("update");
      const auctions = new Auctions();
      auctions.product_id = Number(product_id);
      auctions.status = object.status;
      await db.getRepository(Auctions).save(auctions);
    } else {
      data.status = object.status;
      await db.getRepository(Auctions).save(data);
    }

    res.json(data);
  },
};

export default auctionStatusController;
