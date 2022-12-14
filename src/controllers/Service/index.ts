import { Request, Response } from "express";

import db from "../../data-source";
import { Services } from "../../entities/Service";
import useStorage from "../../libs/useStorage";

type Size = {
  offset: number;
  limit: number;
};
// declare global {
//   namespace Express {
//     interface Request {
//       filename?: any;
//     }
//   }
// }

const serviceController = {
  index: async (req: Request, res: Response) => {
    const { pageSize, page } = req.query;

    const size: Partial<Size> = {};

    if (pageSize) {
      size.offset = (Number(page) - 1) * Number(pageSize) || 0;
      size.limit = Number(pageSize) || 20;
    }

    const data = await db.getRepository(Services).find({
      skip: size.offset,
      take: size.limit,
      order: { id: "desc" },
    });

    res.json(data);
  },
  show: async (req: Request, res: Response) => {
    const { id } = req.params;

    var convertIntToString: number = +id;
    const data = await db.getRepository(Services).find({
      where: {
        id: convertIntToString,
      },
    });
    if (!data) return res.status(404).json({ message: "ไม่พบข้อมูล" });

    res.json(data);
  },
  edit: async (req: Request, res: Response) => {
    return await serviceController.show(req, res);
  },
  store: async (req: Request, res: Response) => {
    const { title, content } = req.body;
    const cover = req.file?.filename;

    const data = new Services();
    data.title = title;
    data.content = content;
    data.cover = cover;
    data.createdAt = new Date();
    data.updatedAt = new Date();

    const create = await db.getRepository(Services).save(data);

    res.json({ message: "เพิ่มข้อมูลสำเร็จ" });
  },
  update: async (req: Request, res: Response) => {
    const { id } = req.params;
    var convertIntToString: number = +id;
    const { title, content } = req.body;

    const data = await db.getRepository(Services).findOne({
      where: {
        id: convertIntToString,
      },
    });

    data!.title = title;
    data!.content = content;
    data!.createdAt = new Date();
    data!.updatedAt = new Date();

    await db.getRepository(Services).save(data!);

    res.json({ message: "บันทึกข้อมูลสำเร็จ" });
  },
  destroy: async (req: Request, res: Response) => {
    const { id } = req.params;
    var convertIntToString: number = +id;
    // await models.Service.delete({ where: { id } })
    const data = await db.getRepository(Services).findOne({ where: { id: convertIntToString } });
    useStorage.destroy("service", data?.cover!);

    await db.getRepository(Services).remove(data!);
    res.json({ message: "success" });
  },
  upload: async (req: Request, res: Response) => {
    const { id } = req.params;
    const cover = req.file!.filename;
    var convertIntToString: number = +id;

    const data = await db.getRepository(Services).findOne({ where: { id: convertIntToString } });
    useStorage.destroy("service", data?.cover!);

    data!.cover = cover;
    await db.getRepository(Services).save(data!);

    res.json(data);
  },
};

export default serviceController;
