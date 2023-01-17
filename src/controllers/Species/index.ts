import { Request, Response } from "express";

import db from "../../data-source";
import { Products } from "../../entities/Products";
import { Biddings } from "../../entities/Biddings";
import { Productimages } from "../../entities/Productimages";

import useStorage from "../../libs/useStorage";
import { IsNull, Like } from "typeorm";
import { TypedRequestBody } from "../../interface/TypedRequest";
import { SpeciesType } from "../../interface/Species";

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
        filenames?: [{ filename: string }];
        video?: [{ filename: string }];
        imageFish?: [{ filename: string }];
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

    const query = await db
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
  data: async (req: Request, res: Response) => {
    const { id } = req.params;

    const query = await db
      .getRepository(Products)
      .createQueryBuilder("products")
      .leftJoinAndSelect("products.productimages", "productimages")
      .leftJoinAndSelect("products.categories", "categories")
      .leftJoinAndSelect("products.fishpond", "fishpond")
      .select([
        "products.sku",
        "products.sold",
        "productimages.filename",
        "products.certificate",
        "categories.name",
        "products.bloodline",
        "products.birthday",
        "products.age",
        "products.gender",
        "products.import_date",
        "products.size",
        "fishpond.fish_pond_id",
        "products.price as price_sell",
        "products.price_buy",
      ])
      .getMany();

    if (!query) return res.status(404).json({ status: false, message: "ไม่พบข้อมูล" });

    res.json({ status: true, data: query });
  },
  dataId: async (req: Request, res: Response) => {
    const { id } = req.params;

    const query = await db
      .getRepository(Products)
      .createQueryBuilder("products")
      .leftJoinAndSelect("products.productimages", "productimages")
      .leftJoinAndSelect("products.categories", "categories")
      .where("products.id = :id", { id: Number(id) })
      .getMany();

    if (!query) return res.status(404).json({ status: false, message: "ไม่พบข้อมูล" });

    res.json({ status: true, data: query });
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

    if (!data) return res.status(404).json({ status: false, message: "ไม่พบข้อมูล" });

    res.json({ status: true, data: data });
  },
  add: async (req: Request, res: Response) => {
    const objects: {
      title: string;
      cate_id: number; //สายพันธ์ปลา
      note: string;
      sku: string; //รหัสปลา
      farm: string; //ฟาร์ม
      size: string; //ไซต์
      gender: string; //เพศ
      age: string; // อายุ
      sold: string; // ขาย
      rate: number; //การประเมินค่า
      // youtube: string; //ลิ้งยูทูป
      auctionOnly: number; //ประมูลเท่านั้น
      filename: string; //อัพโหลดรูปปลา
      video: string; //อัพโหลดรูปปลา
      certificate: string; //อัพโหลดรูปปลา
      weight: number; //น้ำหนัก
      length: number; //ความกว้าง
      price_sell: number; //ราคาขาย
      price_buy: number; //ราคาซื้อ
      import_date: Date; //วันที่นำเข้า
      bloodline: string;
      birthday: Date; //วันเกิดปลา
    } = req.body;

    let certificate: string;

    if (req.files!.certificate) {
      certificate = req.files!.certificate[0].filename;
    }

    const store = new Products();
    store.type = "species";
    store.name = objects.title;
    store.cate_id = objects.cate_id;
    store.detail = objects.note;
    store.sku = objects.sku;
    store.farm = objects.farm;
    store.size = objects.size;
    store.gender = objects.gender;
    store.age = objects.age;
    store.rate = objects.rate;
    store.sold = objects.sold;
    store.certificate = certificate!;
    store.auctionOnly = objects.auctionOnly;
    store.createdAt = new Date();
    store.updatedAt = new Date();
    store.birthday = objects.birthday;
    store.weight = objects.weight;
    store.length = objects.length;
    store.price = objects.price_sell;
    store.price_buy = objects.price_buy;
    store.import_date = objects.import_date;
    store.bloodline = objects.bloodline;

    const data = await db.getRepository(Products).save(store);

    const images: Array<ImageFile> = [];

    req.files?.["filenames"]!.map((file, index: number) => {
      images.push({
        product_id: data.id,
        filename: file.filename,
        type: "image",
      });
    });

    req.files?.["video"]!.map((file, index: number) => {
      images.push({
        product_id: data.id,
        filename: file.filename,
        type: "video",
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

    const result = await db.getRepository(Products).find({
      relations: {
        productimages: true,
      },
      where: {
        id: data.id,
      },
    });

    res.json({ status: true, data: result });
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
        String(req.query.fishpond_id).length != 0
          ? { fishpond: { fish_pond_id: Like(`%${req.query.fishpond_id}%`) } }
          : { fishpond: { fish_pond_id: IsNull() } },
      ],
    });
    // if (!results == null) return res.json("ไม่พบข้อมูล ");
    res.json(results);
  },
  updateImage: async (req: Request, res: Response) => {
    const images: Array<ImageFile> = [];

    const data = await db.getRepository(Productimages).findOneBy({ id: Number(req.params.id) });

    // return res.json(data);
    if (!data) {
      return res.json({ message: "ไม่พบข้อมูล" });
    }

    req.files?.["imageFish"]!.map((file, index: number) => {
      images.push({
        product_id: Number(data.id),
        filename: file.filename,
        type: "image",
      });
    });

    req.files?.["video"]!.map((file, index: number) => {
      images.push({
        product_id: Number(data.id),
        filename: file.filename,
        type: "video",
      });
    });

    for (let i = 0; i < images.length; i++) {
      if (images.length > 0) {
        data.product_id = images[i].product_id;
        data.filename = images[i].filename;
        data.type = images[i].type!;
        data.createdAt = new Date();
        data.updatedAt = new Date();
        await db.getRepository(Productimages).save(data);
      }
    }

    const result = await db.getRepository(Products).find({
      where: {
        id: data.id,
      },
    });

    return res.json(result);
  },
  update: async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = await db.getRepository(Products).findOne({
      where: { id: Number(id) },
    });
    if (!data) return res.status(404).json({ message: "ไม่พบข้อมูล" });

    // return res.json(data);
    const result = await db
      .createQueryBuilder()
      .update(Products)
      .set({
        cate_id: data.cate_id,
        pond_id: data.pond_id,
        type: data.type,
        name: data.name,
        price: data.price,
        detail: data.detail,
        sku: data.sku,
        farm: data.farm,
        size: data.size,
        gender: data.gender,
        age: data.age,
        sold: data.sold,
        rate: data.rate,
        certificate: data.certificate,
        user_id: data.user_id,
        auctionOnly: data.auctionOnly,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        birthday: data.birthday,
        price_buy: data.price_buy,
        weight: data.weight,
        length: data.length,
        grade: data.grade,
        bloodline: data.bloodline,
        import_date: data.import_date,
      })
      .where("id = :id", { id: id })
      .execute();

    res.json({ status: true, data: result });
  },
  delete: async (req: Request, res: Response) => {
    await db
      .createQueryBuilder()
      .delete()
      .from(Products)
      .where("id = :id", { id: Number(req.params?.id) })
      .execute();

    res.json({ status: true, message: `ลบข้อมูลที่ ${req.params?.id} เรียบร้อยแล้ว` });
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
