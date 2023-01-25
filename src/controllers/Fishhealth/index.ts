import { Request, Response } from "express";
import { Fishhealth } from "../../entities/Fishhealth";
import db from "../../data-source";
import { TypedRequestBody } from "../../interface/TypedRequest";
import { FishHealthType } from "../../interface/FishHealth";
import { Products } from "../../entities/Products";

const fishhealthontroller = {
  show: async (req: Request, res: Response) => {
    const data = await db.getRepository(Fishhealth).find({
      // relations: {
      //   products: true,
      // },
    });

    res.json({ status: true, data: data });
  },

  showById: async (req: Request, res: Response) => {
    const data = await db.getRepository(Fishhealth).findOneBy({ id: Number(req.params.id) });

    if (!data) return res.json({ status: false, message: "ไม่พบข้อมูล" });

    res.json({ status: true, data: data });
  },

  add: async (req: TypedRequestBody<FishHealthType>, res: Response) => {
    const fishgrow = new Fishhealth();

    const data = await db.getRepository(Products).findOneBy({ id: Number(req.body.product_id) });

    if (!data) return res.json({ status: false, message: "ไม่พบข้อมูล" });

    fishgrow.product_id = req.body.product_id;
    fishgrow.symptom = req.body.symptom;
    fishgrow.note = req.body.note;
    fishgrow.history_date = req.body.history_date;
    fishgrow.createdAt = new Date();
    fishgrow.updatedAt = new Date();

    const dataId = await db.getRepository(Fishhealth).save(fishgrow);

    res.json({ status: true, data: data });
  },

  delete: async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    await db.getRepository(Fishhealth).delete({ id: id });

    res.json({ status: true, message: `ลบข้อมูลที่ ${req.params?.id} เรียบร้อยแล้ว` });
  },
  //Edit
  edit: async (req: Request, res: Response) => {
    const data = await db.getRepository(Fishhealth).findOneBy({
      id: Number(req.params.id),
    });

    if (!data) {
      return res.json({ status: false, message: "ไม่พบข้อมูล" });
    }

    res.json({ status: true, data: data });
  },
  update: async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const data = await db.getRepository(Fishhealth).findOneBy({
      id: id,
    });

    if (!data) {
      return res.json({ status: false, message: "ไม่พบข้อมูล" });
    }

    data.product_id = req.body.product_id;
    data.user_id = req.body.user_id;
    data.symptom = req.body.symptom;
    data.history_date = req.body.history_date;
    data.createdAt = new Date();
    data.updatedAt = new Date();

    await db.getRepository(Fishhealth).save(data);

    const result = await db.getRepository(Fishhealth).findOneBy({ id: id });

    res.json({ status: true, data: result });
  },
};

export default fishhealthontroller;
