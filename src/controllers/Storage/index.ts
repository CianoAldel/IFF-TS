import { Request, Response } from "express";
import db from "../../data-source";
import { Productimages } from "../../entities/Productimages";
import useStorage from "../../libs/useStorage";

interface Images {
  product_id: number;
  filename: string;
  type: string;
}

const storageController = {
  vdo: async (req: Request, res: Response) => {
    const { id } = req.params;

    const objects: {
      filename: string;
    } = req.body;

    const images = new Productimages();
    images.filename = objects.filename;
    images.product_id = Number(id);
    images.type = "video";
    images.createdAt = new Date();
    images.updatedAt = new Date();

    const data = await db.getRepository(Productimages).save(images);

    return res.json(data);
  },
  upload: async (req: Request, res: Response) => {
    const { id } = req.params;

    const images: Images[] = [];

    req.files["filename[]"].map((file: any) => {
      images.push({
        product_id: Number(id),
        filename: file.filename,
        type: "image",
      });
    });

    const data = await db.getRepository(Productimages).insert(images);

    res.json(data);
  },
  destroy: async (req: Request, res: Response) => {
    const { folder, id } = req.params;
    const data = await db.getRepository(Productimages).findOne({ where: { id: Number(id) } });

    if (!data) return res.json({ message: "ไม่พบไฟล์ดังกล่าว" });

    if (data.type == "image") {
      useStorage.destroy(folder, data.filename);
    }
    await db.createQueryBuilder().delete().from(Productimages).where("id = :id", { id: data.id }).execute();

    res.json({ message: "success" });
  },
  removeAll: async (req: Request, res: Response) => {
    const { folder } = req.params;
    // let { id } = req.body;

    const data = await db.getRepository(Productimages).find({
      select: { filename: true },
    });

    useStorage.removeAll(folder, data);

    await db.getRepository(Productimages).remove(data);
    res.json({ message: "success" });
  },
};

export default storageController;
