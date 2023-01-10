import { Request, Response } from "express";
import { Fishpond } from "../../entities/Fishpond";
import { FishPondType } from "../../interface/FishPond";
import { TypedRequestBody } from "../../interface/TypedRequest";
import db from "../../data-source";

const fishpondController = {
  show: async (req: Request, res: Response) => {
    const data = await db.getRepository(Fishpond).find({
      relations: {
        products: true,
        fishschedules: true,
      },
    });
    res.json(data);
  },

  add: async (req: TypedRequestBody<FishPondType>, res: Response) => {
    const fishpond = new Fishpond();
    fishpond.user_id = req.body.user_id;
    fishpond.fish_pond_id = req.body.fish_pond_id;
    fishpond.fish_pond_name = req.body.fish_pond_name;
    fishpond.status = req.body.status;
    fishpond.note = req.body.note;
    fishpond.schedules = req.body.schedules;
    fishpond.createdAt = new Date();
    fishpond.updatedAt = new Date();

    await db.getRepository(Fishpond).save(fishpond);
    res.status(200).json({ success: "success" });
  },

  delete: async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    await db.getRepository(Fishpond).delete({ id: id });

    res.status(200).json({ success: true, deleteId: id });
  },
  //Edit
  edit: async (req: TypedRequestBody<FishPondType>, res: Response) => {},
  update: async (req: TypedRequestBody<FishPondType>, res: Response) => {
    const id = Number(req.body.id);

    const data = await db.getRepository(Fishpond).findOneBy({
      id: id,
    });

    if (data) {
      data.fish_pond_id = req.body.fish_pond_id;
      data.fish_pond_name = req.body.fish_pond_name;
      data.status = req.body.status;
      data.note = req.body.note;
      data.status = req.body.status;
      data.createdAt = new Date();
      data.updatedAt = new Date();

      await db.getRepository(Fishpond).save(data);
    }
  },
};

export default fishpondController;
