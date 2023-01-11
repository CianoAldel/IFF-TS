import { Request, Response } from "express";

import db from "../../data-source";
import { TypedRequestQuery } from "../../interface/TypedRequest";
import { TypedRequestBody } from "../../interface/TypedRequest";
import { Schedules } from "../../interface/FishSchedules";
import { Fishschedules } from "../../entities/Fishschedules";
import moment from "moment";

// today
// tomorrow
// yesterday

const fishschedulesController = {
  show: async (req: TypedRequestQuery<Schedules>, res: Response) => {
    const result = await db
      .getRepository(Fishschedules)
      .createQueryBuilder("schedules")
      .leftJoinAndSelect("schedules.products", "products")
      .leftJoinAndSelect("products.fishpond", "fishpond_products")
      .leftJoinAndSelect("schedules.fishpond", "fishpond")
      .where(!req.query.status ? "schedules.status IS NOT NULL" : "schedules.status = :status", {
        status: req.query.status,
      })
      .getMany();

    result.forEach((element) => {
      const dateEnd = moment(element.date_end).format("YYYY-MM-DD");
      const currentDate = moment().format("YYYY-MM-DD");

      const dateCheck =
        Number(moment(element.date_end).format("YYYY-MM-DD").split("-")[2]) - Number(currentDate.split("-")[2]);

      if (currentDate == dateEnd) {
        element.date_status = "ToDay";
      } else if (dateCheck == 1) {
        element.date_status = "Tomorrow";
      } else if (dateCheck - 1) {
        element.date_status = "Yesterday";
      } else {
        element.date_status = element.date_end.toISOString();
      }
    });

    if (!result) return res.status(400).json({ message: "no status in your request" });

    res.json(result);
  },

  add: async (req: TypedRequestBody<Schedules>, res: Response) => {
    const data = req.body;
    const add = new Fishschedules();

    add.product_id = data.product_id;
    add.pond_id = data.pond_id;
    add.date_start = moment().toDate();
    add.date_end = data.date_end;
    add.event_status = data.event_status;
    add.status = data.status;
    add.manage_status = "ยังไม่ได้ดำเนินการ";

    // check date end >= date start

    await db.getRepository(Fishschedules).save(add);

    res.status(200).json({ success: true });
  },

  delete: async (req: Request, res: Response) => {
    await db.getRepository(Fishschedules).delete({ id: Number(req.params.id) });

    res.status(200).json({ success: true });
  },
  edit: async (req: Request, res: Response) => {
    const result = await db.getRepository(Fishschedules).findOne({
      where: { id: Number(req.params.id) },
      relations: {
        products: true,
      },
    });
    res.status(200).json(result);
  },
  update: async (req: TypedRequestBody<Schedules>, res: Response) => {
    const dataId = await db.getRepository(Fishschedules).findOne({
      where: { id: Number(req.body.id) },
    });

    if (!dataId) return res.status(400).json({ message: "Not found data" });

    dataId.event_status = req.body.event_status;
    dataId.date_end = req.body.date_end;
    dataId.status = req.body.status;

    await db.getRepository(Fishschedules).save(dataId);
  },
};

export default fishschedulesController;
