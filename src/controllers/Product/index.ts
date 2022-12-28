import { Request, Response } from "express";

import db from "../../data-source";
import { Products } from "../../entities/Products";
import { Productimages } from "../../entities/Productimages";

interface Category {
  type: string;
  cate_id?: number;
}

type Size = {
  offset: number;
  limit: number;
};

const productController = {
  index: async (req: Request, res: Response) => {
    const { cate_id, pageSize, page } = req.query;

    const size: Partial<Size> = {};

    if (pageSize) {
      size.offset = (Number(page) - 1) * Number(pageSize) || 0;
      size.limit = Number(pageSize) || 20;
    }

    var where: Partial<Category> = {
      type: "product",
    };

    if (cate_id) {
      where = {
        type: "product",
        cate_id: Number(cate_id),
      };
    }

    //you forget is not null
    const data = await db.getRepository(Products).find({
      skip: size.offset,
      take: size.limit,
      order: { id: "desc" },
      select: {
        id: true,
        cate_id: true,
        type: true,
        name: true,
        detail: true,
        price: true,
        createdAt: true,
        updatedAt: true,
      },
      relations: ["productimages"],
      where: { type: where.type, cate_id: where.cate_id! },
    });

    res.json(data);
  },
};

export default productController;
