import { Request, Response, query } from "express";

import db from "../../data-source";
import { TypedRequestBody } from "../../interface/TypedRequest";
import { Schedules } from "../../interface/FishSchedules";
import { Fishschedules } from "../../entities/Fishschedules";
import moment from "moment";
import { Schedulecount } from "../../entities/Schedulecount";
import { Fishschedulestock } from "../../entities/Fishschedulestock";

const fishschedulesController = {
  show: async (req: Request, res: Response) => {
    //รับ query กับ body

    if (req.query.manage_status != null && req.query.status != null) {
      const result = await db
        .getRepository(Fishschedulestock)
        .createQueryBuilder("fishschedulestock")
        .leftJoinAndSelect("fishschedulestock.fishschedules", "fishschedules")
        .leftJoinAndSelect("fishschedulestock.products", "products")
        .leftJoinAndSelect("fishschedulestock.fishpond", "fishpond")
        .where("fishschedules.status = :status", {
          status: req.query.status,
        })
        .orWhere("fishschedules.manage_status = :manage_status", {
          manage_status: req.query.manage_status,
        })
        .getMany();

      if (!result) return res.status(400).json({ message: "no status in your request" });

      res.json(result);
    } else {
      const result = await db
        .getRepository(Fishschedulestock)
        .createQueryBuilder("fishschedulestock")
        .leftJoinAndSelect("fishschedulestock.fishschedules", "fishschedules")
        .leftJoinAndSelect("fishschedulestock.products", "products")
        .leftJoinAndSelect("fishschedulestock.fishpond", "fishpond")
        .orderBy("fishschedules.priority", "ASC")
        .addOrderBy("fishschedules.date_schedules", "ASC")
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
      .getRepository(Fishschedulestock)
      .createQueryBuilder("fishschedulestock")
      .leftJoinAndSelect("fishschedulestock.fishschedules", "fishschedules")
      .leftJoinAndSelect("fishschedulestock.products", "products")
      .leftJoinAndSelect("products.fishpond", "fishpond")
      .where(`fishschedules.date_schedules BETWEEN '${start}' AND '${end}'`)
      .andWhere("fishschedules.manage_status = :manage_status", {
        manage_status: manage_status,
      })
      .getMany();

    if (!result) return res.status(400).json({ message: "no data body in your request" });

    res.json(result);
  },

  add: async (req: Request, res: Response) => {
    const data: {
      title: string;
      category: string;
      manage_status: string;
      product_id: Array<number>;
      pond_id: Array<number>;
      date_start: Date;
      date_schedules: Date;
      repeat_date: number;
      note: string;
    } = req.body;

    const addFishschedules = new Fishschedules();
    const schedulecounts = new Schedulecount();

    let repeat_date: Date;

    if (req.body.repeat_date != null) {
      repeat_date = moment(data.date_schedules).add(-7, "hour").add(data.repeat_date, "day").toDate();
    }

    addFishschedules.event_status = data.title;
    addFishschedules.status = data.category;
    addFishschedules.manage_status = data.manage_status;
    addFishschedules.date_start = moment().toDate();
    addFishschedules.date_schedules = moment(data.date_schedules).add(-7, "hour").toDate();
    addFishschedules.repeat_date = repeat_date!;
    addFishschedules.notification_status = true;
    addFishschedules.note = data.note;
    addFishschedules.createdAt = new Date();
    addFishschedules.updatedAt = new Date();

    //add schedules
    const schedulesId = await db.getRepository(Fishschedules).save(addFishschedules);
    //add schedules stock

    for (let i = 0; i < data.product_id.length; i++) {
      const element = data.product_id[i];

      await db
        .createQueryBuilder()
        .insert()
        .into(Fishschedulestock)
        .values([{ schedule_id: schedulesId.id, product_id: element }])
        .execute();
    }

    for (let j = 0; j < data.pond_id.length; j++) {
      const element = data.pond_id[j];
      await db
        .createQueryBuilder()
        .insert()
        .into(Fishschedulestock)
        .values([{ schedule_id: schedulesId.id, pond_id: element }])
        .execute();
    }

    //add schedulecount
    schedulecounts.fish_schedule_id = schedulesId.id;
    await db.getRepository(Schedulecount).save(schedulecounts);

    res.status(200).json({ success: true });
  },

  schedules: async (req: Request, res: Response) => {
    const queryId = Number(req.params.id);
    let priority: number;
    const data: {
      manage_status: string;
    } = req.body;

    const add = new Fishschedules();
    const schedulecounts = new Schedulecount();
    const fishSchedulestock = new Fishschedulestock();

    const currentDate = new Date();
    const findSchedules = await db.getRepository(Fishschedules).findOneBy({ id: queryId });

    const findScheduleStock = await db.getRepository(Fishschedulestock).find({
      where: { schedule_id: queryId },
    });

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
      findSchedules!.manage_status = data.manage_status;
      findSchedules!.priority = priority!;
      await db.getRepository(Fishschedules).save(findSchedules);
    }

    if (
      findSchedules!.repeat_date! >= currentDate &&
      findSchedules!.repeat_date !== null &&
      findSchedules!.manage_status == "เสร็จสิ้น"
    ) {
      //convert repeat_date to date and find day
      const date = new Date(findSchedules!.repeat_date).getDate() - new Date(findSchedules!.date_schedules).getDate();
      const repeat_date = moment(findSchedules?.repeat_date).add(date, "day").toDate();

      add.date_start = moment().toDate();
      add.date_schedules = findSchedules!.repeat_date;
      add.repeat_date = repeat_date;
      add.event_status = findSchedules!.event_status;
      add.status = findSchedules!.status;
      add.manage_status = "ยังไม่ได้ดำเนินการ";
      add.priority = 1;
      add.createdAt = new Date();
      add.updatedAt = new Date();

      const schedulesId = await db.getRepository(Fishschedules).save(add);

      // loop save array pondId and productId
      for (let index = 0; index < findScheduleStock.length; index++) {
        const element = findScheduleStock[index].product_id;
        if (element != null) {
          await db
            .createQueryBuilder()
            .insert()
            .into(Fishschedulestock)
            .values([{ schedule_id: schedulesId.id, product_id: element }])
            .execute();
        }
      }

      for (let j = 0; j < findScheduleStock.length; j++) {
        const element = findScheduleStock[j].pond_id;
        if (element != null) {
          await db
            .createQueryBuilder()
            .insert()
            .into(Fishschedulestock)
            .values([{ schedule_id: schedulesId.id, pond_id: element }])
            .execute();
        }
      }

      schedulecounts.fish_schedule_id = schedulesId.id;
      await db.getRepository(Schedulecount).save(schedulecounts);

      const result = await db.getRepository(Fishschedules).findOneBy({ id: schedulesId.id });

      return res.status(200).json({ success: true, data: result });
    } else if (
      findSchedules!.repeat_date! <= currentDate &&
      findSchedules!.repeat_date !== null &&
      findSchedules!.manage_status == "เสร็จสิ้น"
    ) {
      const date = new Date(findSchedules!.repeat_date).getDate() - new Date(findSchedules!.date_schedules).getDate();
      const repeat_date = moment().add(date, "day").toDate();

      add.date_start = moment().toDate();
      add.date_schedules = currentDate;
      add.repeat_date = repeat_date;
      add.event_status = findSchedules!.event_status;
      add.status = findSchedules!.status;
      add.manage_status = "ยังไม่ได้ดำเนินการ";
      add.priority = 1;
      add.createdAt = new Date();
      add.updatedAt = new Date();

      const schedulesId = await db.getRepository(Fishschedules).save(add);

      for (let index = 0; index < findScheduleStock.length; index++) {
        const element = findScheduleStock[index].product_id;
        if (element != null) {
          await db
            .createQueryBuilder()
            .insert()
            .into(Fishschedulestock)
            .values([{ schedule_id: schedulesId.id, product_id: element }])
            .execute();
        }
      }

      for (let j = 0; j < findScheduleStock.length; j++) {
        const element = findScheduleStock[j].pond_id;

        if (element != null) {
          await db
            .createQueryBuilder()
            .insert()
            .into(Fishschedulestock)
            .values([{ schedule_id: schedulesId.id, pond_id: element }])
            .execute();
        }
      }

      schedulecounts.fish_schedule_id = schedulesId.id;
      await db.getRepository(Schedulecount).save(schedulecounts);

      const result = await db.getRepository(Fishschedules).findOneBy({ id: schedulesId.id });
      return res.status(200).json({ success: true, data: result });
    }

    if (findSchedules!.repeat_date === null && findSchedules?.manage_status === "เสร็จสิ้น") {
      findSchedules.manage_status = data.manage_status;
      findSchedules.priority = priority!;
      await db.getRepository(Fishschedules).save(findSchedules);
      return res.status(200).json({ success: true, data: "อัพเดทสถานะ กำลังดำเนินการ เสร็จสิ้น" });
    }

    if (
      findSchedules!.repeat_date === null ||
      (findSchedules!.repeat_date !== null && findSchedules?.manage_status === "กำลังดำเนินการ")
    ) {
      findSchedules!.manage_status = data.manage_status;
      findSchedules!.priority = priority!;
      await db.getRepository(Fishschedules).save(findSchedules!);

      return res.status(200).json({ success: true, data: "อัพเดทสถานะ กำลังดำเนินการ เสร็จสิ้น" });
    }
    res.status(400).json({ success: false, data: "อัพเดทสถานะ ล้มเหลว" });
  },

  edit: async (req: Request, res: Response) => {
    const result = await db
      .getRepository(Fishschedulestock)
      .createQueryBuilder("fishschedulestock")
      .leftJoinAndSelect("fishschedulestock.fishschedules", "fishschedules")
      .leftJoinAndSelect("fishschedulestock.products", "products")
      .leftJoinAndSelect("products.fishpond", "fishpond")
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
