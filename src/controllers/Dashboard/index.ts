import { Request, Response } from "express";

import db from "../../data-source";
import { Categories } from "../../entities/Categories";
import { Products } from "../../entities/Products";

const dashboardController = {
  index: async (req: Request, res: Response) => {
    const dashboard = {
      categorySpecies: {
        title: "สายพันธุ์",
        count: 0,
      },
      categoryProduct: {
        title: "หมวดหมู่สินค้า",
        count: 0,
      },
      product: {
        title: "สินค้า",
        count: 0,
      },
      species: {
        title: "พันธุ์ปลา",
        count: 0,
      },
    };

    dashboard.categorySpecies.count = await db.getRepository(Categories).count({
      where: {
        type: "species",
      },
    });

    dashboard.categoryProduct.count = await db.getRepository(Categories).count({
      where: {
        type: "product",
      },
    });

    dashboard.product.count = await db.getRepository(Products).count({
      where: {
        type: "product",
      },
    });

    dashboard.species.count = await db.getRepository(Products).count({
      where: {
        type: "species",
      },
    });

    res.json(dashboard);
  },
};

export default dashboardController;
