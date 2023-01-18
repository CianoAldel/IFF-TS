import { Request, Response } from "express";
import { Fishpond } from "../../entities/Fishpond";
import { FishPondType } from "../../interface/FishPond";
import { TypedRequestBody, TypedRequestQuery } from "../../interface/TypedRequest";
import db from "../../data-source";
import { Between, IsNull, Like } from "typeorm";

const fishpondController = {
  show: async (req: Request, res: Response) => {
    const data = await db.getRepository(Fishpond).find({
      relations: {
        products: true,
      },
    });
    res.json({ status: true, data: data });
  },
  showById: async (req: Request, res: Response) => {
    const data = await db.getRepository(Fishpond).findOne({
      relations: {
        products: true,
      },
      where: {
        id: Number(req.params.id),
      },
    });

    if (!data) return res.status(404).json({ status: false, message: `ไม่พบข้อมูล ${req.params.id}` });

    res.json({ status: true, data: data });
  },
  pond: async (req: Request, res: Response) => {
    const categories = await db
      .getRepository(Fishpond)
      .createQueryBuilder("fishpond")
      .select(["id AS value", "fish_pond_id AS label"])
      .getRawMany();

    //value = id ของ categories ที่จะส่งมาให้
    //label = name ที่จะเอาไปแสดงผล

    let array: Array<any | number> = [];

    categories.map((element, index) => {
      const result = {
        id: index + 1,
        value: element.value,
        label: element.label,
      };
      array.push(result);
    });

    res.json(array);
  },
  filter: async (req: TypedRequestQuery<FishPondType>, res: Response) => {
    let results = await db.getRepository(Fishpond).find({
      where: [
        req.query.fish_pond_id.length != 0 ? { fish_pond_id: Like(`%${req.query.fish_pond_id}%`) } : {},
        req.query.fish_pond_name.length != 0 ? { fish_pond_name: Like(`%${req.query.fish_pond_name}%`) } : {},
        req.query.note.length != 0 ? { note: Like(`%${req.query.note}%`) } : {},
        req.query.status.length != 0 ? { status: Like(`%${req.query.status}%`) } : {},
        { use_pond_date: Between(req.query.start_date, req.query.end_date) },
      ],
    });
    res.json(results);
  },
  add: async (req: TypedRequestBody<FishPondType>, res: Response) => {
    const fishpond = new Fishpond();
    fishpond.user_id = req.body.user_id;
    fishpond.fish_pond_id = req.body.fish_pond_id;
    // fishpond.fish_pond_name = req.body.fish_pond_name;
    fishpond.use_pond_date = new Date(req.body.use_pond_date);
    fishpond.status = req.body.status;
    fishpond.note = req.body.note;
    fishpond.createdAt = new Date();
    fishpond.updatedAt = new Date();

    const dataId = await db.getRepository(Fishpond).save(fishpond);

    const result = db.getRepository(Fishpond).findOneBy({ id: dataId.id });

    res.status(200).json({ status: true, data: result });
  },

  delete: async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    await db.getRepository(Fishpond).delete({ id: id });

    res.status(200).json({ success: true, deleteId: id });
  },
  //Edit
  edit: async (req: Request, res: Response) => {
    const data = await db.getRepository(Fishpond).findOneBy({
      id: Number(req.params.id),
    });

    res.json({ status: true, data: data });
  },
  update: async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const data = await db.getRepository(Fishpond).findOneBy({
      id: id,
    });
    if (!data) return res.status(404).json({ status: false, message: `ไม่พบข้อมูลที่ ${req.params.id}` });

    data.fish_pond_id = req.body.fish_pond_id;
    data.status = req.body.status;
    data.note = req.body.note;
    data.status = req.body.status;
    data.createdAt = new Date();
    data.updatedAt = new Date();

    const result = await db.getRepository(Fishpond).save(data);
    res.json({ status: true, data: result });
  },
};

export default fishpondController;
