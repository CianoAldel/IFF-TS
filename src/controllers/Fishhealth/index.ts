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

  add: async (req: TypedRequestBody<Fishhealth>, res: Response) => {
    const fishgrow = new Fishhealth();

    fishgrow.product_id = req.body.product_id;
    fishgrow.status = req.body.status;
    fishgrow.user_id = req.body.symptom;
    fishgrow.status_health = req.body.status_health;
    fishgrow.createdAt = new Date();
    fishgrow.updatedAt = new Date();

    await db.getRepository(Fishhealth).save(fishgrow);

    res.status(200).json({ success: "success" });
  },

  delete: async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    await db.getRepository(Fishhealth).delete({ id: id });

    res.status(200).json({ success: true, deleteId: id });
  },
  //Edit
  update: async (req: TypedRequestBody<FishHealthType>, res: Response) => {
    const id = Number(req.body.id);

    const data = await db.getRepository(Fishhealth).findOneBy({
      id: id,
    });

    if (data) {
      data.product_id = req.body.product_id;
      data.status = req.body.status;
      data.user_id = req.body.symptom;
      data.status_health = req.body.status_health;
      data.createdAt = new Date();
      data.updatedAt = new Date();

      await db.getRepository(Fishhealth).save(data);
    }
  },
};

export default fishhealthontroller;
