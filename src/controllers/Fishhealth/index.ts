import { Request, Response } from "express";
import { Fishhealth } from "../../entities/Fishhealth";
import db from "../../data-source";
import { TypedRequestBody } from "../../interface/TypedRequest";
import { FishHealthType } from "../../interface/FishHealth";

const fishhealthontroller = {
  show: async (req: Request, res: Response) => {
    const data = await db.getRepository(Fishhealth).find({
      relations: {
        products: true,
      },
    });

    res.json(data);
  },

  showById: async (req: Request, res: Response) => {
    const data = await db.getRepository(Fishhealth).findOneBy({ id: Number(req.params.id) });

    if (!data) return res.json({ status: false, message: "ไม่พบข้อมูล" });

    res.json({ status: true, data: data });
  },

  add: async (req: TypedRequestBody<FishHealthType>, res: Response) => {
    const fishgrow = new Fishhealth();

    fishgrow.product_id = req.body.product_id;
    fishgrow.status = req.body.status;
    fishgrow.symptom = req.body.symptom;
    fishgrow.status_health = req.body.status_health;
    fishgrow.createdAt = new Date();
    fishgrow.updatedAt = new Date();

    const dataId = await db.getRepository(Fishhealth).save(fishgrow);

    const data = await db.getRepository(Fishhealth).findOneBy({ id: Number(dataId.id) });

    if (!data) return res.json({ status: false, message: "ไม่พบข้อมูล" });

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
    data.status = req.body.status;
    data.user_id = req.body.symptom;
    data.status_health = req.body.status_health;
    data.createdAt = new Date();
    data.updatedAt = new Date();

    await db.getRepository(Fishhealth).save(data);

    const result = await db.getRepository(Fishhealth).findOneBy({ id: id });

    res.json({ status: true, data: result });
  },
};

export default fishhealthontroller;
