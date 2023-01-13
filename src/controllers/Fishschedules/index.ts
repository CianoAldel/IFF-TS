import { Request, Response } from "express";

import db from "../../data-source";
import { TypedRequestQuery } from "../../interface/TypedRequest";
import { TypedRequestBody } from "../../interface/TypedRequest";
import { Schedules } from "../../interface/FishSchedules";
import { Fishschedules } from "../../entities/Fishschedules";
import moment from "moment";
import { Products } from "../../entities/Products";
import { Fishpond } from "../../entities/Fishpond";

const fishschedulesController = {
  show: async (req: Request, res: Response) => {
    const manage_status: string = req.body.manage_status;

    //รับ query กับ body

    if (req.query.manage_status != null && req.query.manage_status != null) {
      const result = await db
        .getRepository(Fishschedules)
        .createQueryBuilder("schedules")
        .leftJoinAndSelect("schedules.products", "products")
        .leftJoinAndSelect("products.fishpond", "fishpond_products")
        .leftJoinAndSelect("schedules.fishpond", "fishpond")
        .where("schedules.status = :status", {
          status: req.query.status,
        })
        .orWhere("schedules.manage_status = :manage_status", {
          manage_status: manage_status,
        })
        .getMany();

      if (!result) return res.status(400).json({ message: "no status in your request" });

      res.json(result);
    } else {
      const result = await db
        .getRepository(Fishschedules)
        .createQueryBuilder("schedules")
        .leftJoinAndSelect("schedules.products", "products")
        .leftJoinAndSelect("products.fishpond", "fishpond_products")
        .leftJoinAndSelect("schedules.fishpond", "fishpond")
        .orderBy("schedules.priority", "ASC")
        .addOrderBy("schedules.date_schedules", "ASC")
        .getMany();

      if (!result) return res.status(400).json({ message: "no status in your request" });

      res.json(result);
    }
  },

  showBetweenManage: async (req: Request, res: Response) => {
    const manage_status: string = req.body.manage_status;
    const start: Date = req.body.start;
    const end: Date = req.body.end;

    const result = await db
      .getRepository(Fishschedules)
      .createQueryBuilder("schedules")
      .leftJoinAndSelect("schedules.products", "products")
      .leftJoinAndSelect("products.fishpond", "fishpond_products")
      .leftJoinAndSelect("schedules.fishpond", "fishpond")
      .where(`schedules.date_schedules BETWEEN '${start}' AND '${end}'`)
      .andWhere("schedules.manage_status = :manage_status", {
        manage_status: manage_status,
      })
      .getMany();

    if (!result) return res.status(400).json({ message: "no data body in your request" });

    res.json(result);
  },

  add: async (req: TypedRequestBody<Schedules>, res: Response) => {
    const data = req.body;
    const add = new Fishschedules();

    let repeat_date: Date;

    if (req.body.repeat_date != null) {
      repeat_date = moment(req.body.date_schedules).add(-7, "hour").add(req.body.repeat_date, "day").toDate();
    }

    add.product_id = data.product_id;
    add.pond_id = data.pond_id;
    add.date_start = moment().toDate();
    add.date_schedules = data.date_schedules;
    add.repeat_date = repeat_date!;
    add.event_status = data.event_status;
    add.status = data.status;
    add.manage_status = "ยังไม่ได้ดำเนินการ";
    add.createdAt = new Date();
    add.updatedAt = new Date();

    await db.getRepository(Fishschedules).save(add);

    res.status(200).json({ success: true });
  },

  schedules: async (req: Request, res: Response) => {
    const queryId = Number(req.params.id);
    let priority: number;
    const data: {
      manage_status: string;
    } = req.body;

    const add = new Fishschedules();

    const findSchedules = await db.getRepository(Fishschedules).findOneBy({ id: queryId });

    if (findSchedules) {
      switch (data.manage_status) {
        case "เสร็จสิ้น":
          priority = 3;
          break;
        case "กำลังดำเนินการ":
          priority = 2;
          break;
        case "ยังไม่ได้ดำเนินการ":
          priority = 1;
          break;
      }
      findSchedules.manage_status = data.manage_status;
      findSchedules.priority = priority!;
      await db.getRepository(Fishschedules).save(findSchedules);
    }

    if (findSchedules!.repeat_date !== null && findSchedules?.manage_status == "เสร็จสิ้น") {
      const date = new Date(findSchedules?.repeat_date!).getDate() - new Date(findSchedules?.date_schedules!).getDate();
      const repeat_date = moment(findSchedules?.repeat_date).add(date, "day").toDate();

      add.product_id = findSchedules!.product_id;
      add.pond_id = findSchedules!.pond_id;
      add.date_start = moment().toDate();
      add.date_schedules = findSchedules!.repeat_date;
      add.repeat_date = repeat_date;
      add.event_status = findSchedules!.event_status;
      add.status = findSchedules!.status;
      add.manage_status = "ยังไม่ได้ดำเนินการ";
      add.priority = 1;
      add.createdAt = new Date();
      add.updatedAt = new Date();

      const dataId = await db.getRepository(Fishschedules).save(add);
      const result = await db.getRepository(Fishschedules).findOneBy({ id: dataId.id });

      return res.status(200).json({ success: true, data: result });
    }

    if (findSchedules!.repeat_date === null && findSchedules?.manage_status == "เสร็จสิ้น") {
      findSchedules.manage_status = data.manage_status;
      findSchedules.priority = priority!;
      await db.getRepository(Fishschedules).save(findSchedules);
      return res.status(200).json({ success: true, data: "อัพเดทสถานะ กำลังดำเนินการ เสร็จสิ้น" });
    }

    if (findSchedules!.repeat_date === null && findSchedules?.manage_status === "กำลังดำเนินการ") {
      findSchedules.manage_status = data.manage_status;
      findSchedules.priority = priority!;

      await db.getRepository(Fishschedules).save(findSchedules);

      return res.status(200).json({ success: true, data: "อัพเดทสถานะ กำลังดำเนินการ เสร็จสิ้น" });
    }

    res.status(400).json({ success: false, data: "อัพเดทสถานะ ล้มเหลว" });
  },

  edit: async (req: Request, res: Response) => {
    const result = await db
      .getRepository(Fishschedules)
      .createQueryBuilder("schedules")
      .leftJoinAndSelect("schedules.products", "products")
      .leftJoinAndSelect("products.fishpond", "fishpond_products")
      .leftJoinAndSelect("schedules.fishpond", "fishpond")
      .getMany();

    res.status(200).json(result);
  },
  update: async (req: TypedRequestBody<Schedules>, res: Response) => {
    const dataId = await db.getRepository(Fishschedules).findOne({
      where: { id: Number(req.body.id) },
    });

    if (!dataId) return res.status(400).json({ message: "Not found data" });

    dataId.event_status = req.body.event_status;
    dataId.date_schedules = req.body.date_schedules;
    dataId.status = req.body.status;

    await db.getRepository(Fishschedules).save(dataId);
  },
  delete: async (req: Request, res: Response) => {
    await db.getRepository(Fishschedules).delete({ id: Number(req.params.id) });

    res.status(200).json({ success: true });
  },
};

export default fishschedulesController;
