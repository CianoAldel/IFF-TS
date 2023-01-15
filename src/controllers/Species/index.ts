import { Request, Response } from "express";

import db from "../../data-source";
import { Products } from "../../entities/Products";
import { Biddings } from "../../entities/Biddings";
import { Productimages } from "../../entities/Productimages";

import useStorage from "../../libs/useStorage";
import { Like } from "typeorm";
import { TypedRequestQuery } from "../../interface/TypedRequest";

interface MulterRequest extends Request {
  file: any;
}

//solution 1# interface File extends Express.Multer.File {
// certificate?:string
// }
// variable: File

// solution 2#
// declare global {
//   namespace Express {
//     interface Request {
//       files?: any;
//     }
//   }
// }
declare global {
  namespace Express {
    interface Request {
      files?: {
        certificate?: [
          {
            filename: string;
          }
        ];
        filename?: [{ filename: string }];
      };
    }
  }
}

type Size = {
  offset: number;
  limit: number;
};

type Certificate = {
  certificate: string;
};

type ImageFile = {
  product_id: number;
  filename: string;
  type?: string;
};

const speciesController = {
  index: async (req: Request, res: Response) => {
    const { cate, page, pageSize, auctionOnly } = req.query;

    console.log("1");

    const size: Partial<Size> = {};

    if (pageSize) {
      size.offset = (Number(page) - 1) * Number(pageSize) || 0;
      size.limit = Number(pageSize) || 20;
    }

    const query = db
      .createQueryBuilder(Products, "products")
      .where("products.type = :type", { type: "species" })
      .andWhere(!cate ? "products.cate_id IS NOT NULL" : "products.cate_id = :cate_id", { cate_id: cate })
      .andWhere(!auctionOnly ? "products.auctionOnly IS NOT NULL" : "products.auctionOnly = :auctionOnly", {
        auctionOnly: auctionOnly,
      })
      .innerJoinAndSelect("products.auctions", "auctions")
      .innerJoinAndSelect("products.productimages", "productimages")
      .offset(size.offset)
      .limit(size.limit);

    const result = await query.getMany();

    res.json(result);
  },
  show: async (req: Request, res: Response) => {
    const { id } = req.params;

    const query = db
      .getRepository(Products)
      .createQueryBuilder("products")
      .where("products.id = :id", { id: id })
      .innerJoinAndSelect("products.productimages", "productimages")
      .innerJoinAndSelect("products.categories", "categories")
      .innerJoinAndSelect("products.auctions", "auctions")
      .innerJoinAndSelect("auctions.biddings", "biddings")
      .innerJoinAndSelect("biddings.user", "user")
      .orderBy("biddings.createdAt", "DESC")
      .addSelect((subquery) => {
        return subquery.from(Biddings, "biddings").select("COUNT(*)").where(`auctions.id = biddings.auction_id`);
      }, "biddingCount")
      .addSelect((subquery) => {
        return subquery.from(Biddings, "biddings").select("SUM(bidding)").where(`auctions.id = biddings.auction_id`);
      }, "totalBidding");

    const result = await query.getRawAndEntities(); // or getRawOne you can see allias in biddings

    if ((result.entities.length && result.raw.length) == 0) {
      return res.json(query);
    }
    const data = {
      ...result.entities[0],
      biddingCount: result.raw[0].biddingCount as number,
      totalBidding: result.raw[0].totalBiddin as number,
    };

    if (!data) return res.status(404).json({ message: "ไม่พบข้อมูล" });

    res.json(data);
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
    const objects: {
      title: string;
      cate_id: number;
      content: string;
      sku: string; //รหัสปลา
      farm: string;
      size: string;
      gender: string;
      age: string;
      sold: string;
      rate: number;
      youtube: string;
      auctionOnly: number;
      filename: string;
    } = req.body;

    let certificate: string;

    if (req.files!.certificate) {
      certificate = req.files!.certificate[0].filename;
    }

    const store = new Products();
    store.type = "species";
    store.name = objects.title;
    store.cate_id = objects.cate_id;
    store.detail = objects.content;
    store.sku = objects.sku;
    store.farm = objects.farm;
    store.size = objects.size;
    store.gender = objects.gender;
    store.age = objects.age;
    store.rate = objects.rate;
    store.sold = objects.sold;
    store.youtube = objects.youtube;
    store.certificate = certificate!;
    store.auctionOnly = objects.auctionOnly;
    store.createdAt = new Date();
    store.updatedAt = new Date();

    const data = await db.getRepository(Products).save(store);

    const images: Array<ImageFile> = [];

    req.files?.["filename"]!.map((file, index: number) => {
      if (objects.filename && typeof objects.filename[index] == "string") {
        images.push({
          product_id: data.id,
          filename: objects.filename[index],
          type: "video",
        });
      }
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

  filter: async (req: Request, res: Response) => {
    let results = await db.getRepository(Products).find({
      where: [
        req.query.sku!.length != 0 ? { sku: Like(`%${req.query.sku}%`) } : {},
        req.query.name!.length != 0 ? { name: Like(`%${req.query.name}%`) } : {},
        req.query.detail!.length != 0 ? { detail: Like(`%${req.query.detail}%`) } : {},
        req.query.farm!.length != 0 ? { farm: Like(`%${req.query.farm}%`) } : {},
        req.query.size!.length != 0 ? { size: Like(`%${req.query.size}%`) } : {},
        req.query.gender!.length != 0 ? { gender: Like(`%${req.query.gender}%`) } : {},
        req.query.age!.length != 0 ? { age: Like(`%${req.query.age}%`) } : {},
        req.query.sold!.length != 0 ? { sold: Like(`%${req.query.sold}%`) } : {},
        req.query.bloodline!.length != 0 ? { bloodline: Like(`%${req.query.bloodline}%`) } : {},
        String(req.query.price_buy).length != 0 ? { price_buy: Like(`%${req.query.price_buy}%`) } : {},
        String(req.query.price).length != 0 ? { price: Like(`%${req.query.price}%`) } : {},
        String(req.query.import_date).length != 0 ? { import_date: Like(`%${req.query.import_date}%`) } : {},
        { fishpond: { fish_pond_name: Like(`%${req.query.fishpond_name}%`) } },
      ],
    });
    if (results == null) return res.json("ไม่พบข้อมูล ");
    res.json(results);
  },
  update: async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = await db.getRepository(Products).findOne({ where: { id: Number(id) } });
    if (!data) return res.status(404).json({ message: "ไม่พบข้อมูล" });

    await db
      .createQueryBuilder()
      .update(Products)
      .set({
        type: "species",
        name: data.name,
        cate_id: data.cate_id,
        detail: data.detail,
        sku: data.sku,
        farm: data.farm,
        size: data.size,
        gender: data.gender,
        age: data.age,
        rate: data.rate,
        sold: data.sold,
        youtube: data.youtube,
        auctionOnly: data.auctionOnly,
      })
      .where("id = :id", { id: data.id })
      .execute();

    res.json(data);
  },
  destroy: async (req: Request, res: Response) => {
    const { id } = req.params;
    // await models.Service.delete({ where: { id } })
    const data = await db.getRepository(Products).findOne({
      where: { id: Number(id) },
      relations: { productimages: true },
    });

    data?.productimages.map((image) => useStorage.destroy("species", image.filename));
    if (data?.certificate) {
      useStorage.destroy("certificate", data.certificate);
    }

    await db.createQueryBuilder().delete().from(Products).where("id = :id", { id: data?.id }).execute();

    res.json({ message: "success" });
  },
  //or update??
  uploadCertificate: async (req: Request, res: Response) => {
    const { id } = req.params;
    const { filename } = (req as MulterRequest).file;

    const data = await db.getRepository(Products).findOne({ where: { id: Number(id) } });

    data!.certificate = filename;
    await db.getRepository(Products).save(data!);
    res.json(filename);
  },
  // or update??
  deleteCertificate: async (req: Request, res: Response) => {
    const { id } = req.params;

    const data = await db.getRepository(Products).findOne({ where: { id: Number(id) } });
    useStorage.destroy("certificate", data?.certificate!);
    data!.certificate = null;
    await db.getRepository(Products).save(data!);

    res.json({ message: "success" });
  },
};

export default speciesController;
