import { Request, Response } from "express";
import db from "../../data-source";
import { Fishgrow } from "../../entities/Fishgrow";
import { FishGrowType } from "../../interface/FishGrow";
import { TypedRequestBody } from "../../interface/TypedRequest";
import { Products } from "../../entities/Products";

const fishgrowController = {
  show: async (req: Request, res: Response) => {
    const data = await db.getRepository(Fishgrow).find({
      // relations: {
      //   products: true,
      // },
      order: {
        createdAt: "DESC",
      },
    });

    if (!data) return res.json({ status: false, message: "ไม่พบข้อมูล" });

    res.json({ status: true, data: data });
  },

  showById: async (req: Request, res: Response) => {
    const data = await db.getRepository(Fishgrow).findOneBy({ id: Number(req.params.id) });

    if (!data) return res.json({ status: false, message: "ไม่พบข้อมูล" });

    res.json({ status: true, data: data });
  },

  add: async (req: TypedRequestBody<FishGrowType>, res: Response) => {
    const fishgrow = new Fishgrow();

    const result = await db.getRepository(Products).findOneBy({ id: Number(req.body.product_id) });

    if (!result) {
      return res.json({ status: false, message: "ไม่พบข้อมูล" });
    }

    fishgrow.product_id = req.body.product_id;
    fishgrow.size = req.body.size;
    fishgrow.weight = req.body.weight;
    fishgrow.note = req.body.note;
    fishgrow.createdAt = new Date();
    fishgrow.updatedAt = new Date();

    const dataId = await db.getRepository(Fishgrow).save(fishgrow);

    res.json({ status: true, message: "เพิ่มข้อมูลสำเร็จ" });
  },

  delete: async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const data = await db.getRepository(Fishgrow).findOneBy({ id: id });
    if (!data) {
      return res.json({ status: false, message: "ไม่พบไอดีที่คุณต้องการลบ" });
    }

    await db.getRepository(Fishgrow).delete({ id: id });

    res.json({ status: true, message: `ลบข้อมูลที่ ${req.params?.id} เรียบร้อยแล้ว` });
  },
  //Edit
  edit: async (req: Request, res: Response) => {
    const data = await db.getRepository(Fishgrow).findOneBy({
      id: Number(req.params.id),
    });

    if (!data) {
      return res.json({ status: false, message: "ไม่พบข้อมูล" });
    }

    res.json({ status: true, data: data });
  },
  update: async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const data = await db.getRepository(Fishgrow).findOneBy({
      id: id,
    });

    if (!data) {
      return res.json({ status: false, message: "ไม่พบข้อมูล" });
    }

    data.product_id = req.body.product_id;
    data.size = req.body.size;
    data.weight = req.body.weight;
    data.note = req.body.note;
    data.createdAt = new Date();
    data.updatedAt = new Date();

    await db.getRepository(Fishgrow).save(data);
    res.json({ status: true, data: data });
  },
};

export default fishgrowController;
