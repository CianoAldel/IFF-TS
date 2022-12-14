import { Request, Response } from "express";

import db from "../../data-source";

// import * as utils from "../PaymentController/utils/index";
// import { Products } from "../../entity/Products";
import { Categories } from "../../entities/Categories";

const categoryController = {
  index: async (req: Request, res: Response) => {
    const { type } = req.params;
    const categories = await db.getRepository(Categories).find({
      where: {
        type: type,
      },
    });
    res.json(categories);
  },
  store: async (req: Request, res: Response) => {
    const body: { name: string; type: string } = req.body;

    const store = new Categories();
    store.name = body.name;
    store.type = body.type;

    const data = await db.getRepository(Categories).save(store);

    res.json({ message: "success" });
  },
};

export default categoryController;
