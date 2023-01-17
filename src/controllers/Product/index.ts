import { Request, Response } from "express";

import db from "../../data-source";
import { Products } from "../../entities/Products";
import { Productimages } from "../../entities/Productimages";
import useStorage from "../../libs/useStorage";
import { TypedRequestQuery } from "../../interface/TypedRequest";
import { Fishpond } from "../../entities/Fishpond";
import { Like } from "typeorm";

interface Category {
  type: string;
  cate_id?: number;
}

type Size = {
  offset: number;
  limit: number;
};

type ImageFile = {
  product_id: number;
  filename: string;
  type?: string;
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
      type: "species", //species,product
    };

    if (cate_id) {
      where = {
        type: "species", //species,product
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
  show: async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await db.getRepository(Products).findOne({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        cate_id: true,
        type: true,
        name: true,
        price: true,
        detail: true,
        createdAt: true,
        updatedAt: true,
      },
      relations: {
        productimages: true,
        categories: true,
      },
    });

    if (!result) return res.status(404).json({ message: "ไม่พบข้อมูล" });

    res.json(result);
  },

  edit: async (req: Request, res: Response) => {
    const { id } = req.params;

    const data = await db.getRepository(Products).findOne({
      where: { id: Number(id) },
      relations: {
        productimages: true,
        categories: true,
      },
    });

    if (!data) return res.status(404).json({ message: "ไม่พบข้อมูล" });

    res.json(data);
  },
  store: async (req: Request, res: Response) => {
    const object: { title: string; cate_id: number; content: string; price: number } = req.body;

    const create = new Products();
    create.name = object.title;
    create.cate_id = object.cate_id;
    create.detail = object.content;
    create.price = object.price;

    const data = await db.getRepository(Products).save(create);

    const images: Array<ImageFile> = [];

    req.files?.["filenames"]!.map((file) => {
      images.push({
        product_id: data.id,
        filename: file.filename,
      });
    });

    for (let i = 0; i < images.length; i++) {
      if (images.length > 0) {
        const storeImages = new Productimages();
        storeImages.product_id = images[i].product_id;
        storeImages.filename = images[i].filename;
        storeImages.type = images[i].type!;
        storeImages.createdAt = new Date();
        storeImages.updatedAt = new Date();

        await db.getRepository(Productimages).save(storeImages);
      }
    }
    res.json(data);
  },
  update: async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, cate_id, content, price } = req.body;

    const data = await db.getRepository(Products).findOne({ where: { id: Number(id) } });

    if (!data) return res.status(404).json({ message: "ไม่พบข้อมูล" });

    data.name = title;
    data.detail = content;
    data.cate_id = cate_id;
    data.price = price;

    await db.getRepository(Products).save(data);

    res.json(data);
  },
  destroy: async (req: Request, res: Response) => {
    const { id } = req.params;
    // await models.Service.delete({ where: { id } })
    const data = await db.getRepository(Products).findOne({
      where: { id: Number(id) },
      relations: {
        productimages: true,
      },
    });

    data?.productimages.map((image) => useStorage.destroy("product", image.filename));

    await db.getRepository(Products).delete({ id: data?.id });

    res.json({ message: "success" });
  },
};

export default productController;
