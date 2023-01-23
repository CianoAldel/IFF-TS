import { Request, Response, query } from "express";

import db from "../../data-source";
import { TypedRequestBody } from "../../interface/TypedRequest";
import { Schedules } from "../../interface/FishSchedules";
import { SchedulesCategory } from "../../entities/Schedulescategory";
import moment from "moment";
import { Fishschedulestock } from "../../entities/Fishschedulestock";
import { FishschedulesRepeat } from "../../entities/Fishschedulesrepeat";
import { Fishscheduleslog } from "../../entities/Fishscheduleslog";
import * as util from "../Fishschedules/util";

const fishschedulesController = {
  show: async (req: Request, res: Response) => {
    if (req.query.event_status != null) {
      const result = await db
        .getRepository(FishschedulesRepeat)
        .createQueryBuilder("repeat")
        .leftJoinAndSelect("repeat.schedulescategory", "catgory")
        .leftJoinAndSelect("repeat.fishschedulestock", "stock")
        .leftJoinAndSelect("repeat.fishscheduleslog", "log")
        .leftJoinAndSelect("stock.products", "products")
        .leftJoinAndSelect("stock.fishpond", "ponds")
        .select([
          "repeat.id",
          "repeat.date_start",
          "repeat.user_id",
          "repeat.note",
          "repeat.repeat_date",
          "repeat.manage_status",
          "repeat.notification_status",
          "repeat.createdAt",
          "repeat.updatedAt",
          "catgory.event_status",
          "stock.fish_repeat_id",
          "stock.fishgroup_id",
          "stock.product_id",
          "stock.pond_id",
          "products.id",
          "products.sku",
          "ponds.fish_pond_id",
        ])
        .andWhere("catgory.event_status = :event_status", {
          event_status: req.query.event_status,
        })
        .orderBy("repeat.priority", "ASC")
        .addOrderBy("repeat.date_schedules", "ASC")
        .getMany();

      if (!result) return res.status(400).json({ message: "no status in your request" });

      res.json(result);
    } else {
      const result = await db
        .getRepository(FishschedulesRepeat)
        .createQueryBuilder("repeat")
        .leftJoinAndSelect("repeat.schedulescategory", "category")
        .leftJoinAndSelect("repeat.fishschedulestock", "stock")
        .leftJoinAndSelect("stock.products", "products")
        .leftJoinAndSelect("stock.fishpond", "ponds")
        .leftJoinAndSelect("stock.fishgroup", "groups")
        .select([
          "repeat.id",
          "repeat.date_start",
          "repeat.user_id",
          "repeat.note",
          "repeat.repeat_date",
          "repeat.manage_status",
          "repeat.notification_status",
          "repeat.createdAt",
          "repeat.updatedAt",
          "category.event_status",
          "stock.fish_repeat_id",
          "stock.fishgroup_id",
          "stock.product_id",
          "stock.pond_id",
          "products.id",
          "products.sku",
          "ponds.fish_pond_id",
        ])
        .orderBy("repeat.priority", "ASC")
        .addOrderBy("repeat.date_schedules", "ASC")
        .getMany();

      if (!result) return res.status(400).json({ message: "no status in your request" });

      res.json(result);
    }
  },

  get: async (req: Request, res: Response) => {
    const result = await db
      .getRepository(SchedulesCategory)
      .createQueryBuilder("category")
      .leftJoinAndSelect("category.fishschedulesrepeat", "repeat")
      .leftJoinAndSelect("repeat.fishschedulestock", "stock")
      .leftJoinAndSelect("stock.products", "products")
      .leftJoinAndSelect("stock.fishpond", "ponds")
      .leftJoinAndSelect("stock.fishgroup", "groups")
      .select([
        "repeat.id",
        "repeat.date_start",
        "repeat.user_id",
        "repeat.note",
        "repeat.repeat_date",
        "repeat.manage_status",
        "repeat.notification_status",
        "repeat.createdAt",
        "repeat.updatedAt",
        "category.event_status",
        "stock.fish_repeat_id",
        "stock.fishgroup_id",
        "stock.product_id",
        "stock.pond_id",
        "products.id",
        "products.sku",
        "ponds.fish_pond_id",
      ])
      .orderBy("repeat.priority", "ASC")
      .addOrderBy("repeat.date_schedules", "ASC")
      .getMany();

    res.json({ status: true, data: result });
  },

  getById: async (req: Request, res: Response) => {
    const result = await db
      .getRepository(SchedulesCategory)
      .createQueryBuilder("category")
      .leftJoinAndSelect("category.fishschedulesrepeat", "repeat")
      .leftJoinAndSelect("repeat.fishschedulestock", "stock")
      .leftJoinAndSelect("stock.products", "products")
      .leftJoinAndSelect("stock.fishpond", "ponds")
      .leftJoinAndSelect("stock.fishgroup", "groups")
      .select([
        "repeat.id",
        "repeat.date_start",
        "repeat.user_id",
        "repeat.note",
        "repeat.repeat_date",
        "repeat.manage_status",
        "repeat.notification_status",
        "repeat.createdAt",
        "repeat.updatedAt",
        "category.event_status",
        "stock.fish_repeat_id",
        "stock.fishgroup_id",
        "stock.product_id",
        "stock.pond_id",
        "products.id",
        "products.sku",
        "ponds.fish_pond_id",
      ])
      .andWhere("repeat.id = :id", {
        id: req.query.id,
      })
      .orderBy("repeat.priority", "ASC")
      .addOrderBy("repeat.date_schedules", "ASC")
      .getMany();

    res.json({ status: true, data: result });
  },

  showBetweenManage: async (req: Request, res: Response) => {
    const manage_status: string = req.body.manage_status;
    const start: Date = req.body.start;
    const end: Date = req.body.end;

    const result = await db
      .getRepository(FishschedulesRepeat)
      .createQueryBuilder("repeat")
      .leftJoinAndSelect("repeat.schedulescategory", "catgory")
      .leftJoinAndSelect("repeat.fishschedulestock", "stock")
      .leftJoinAndSelect("repeat.fishscheduleslog", "log")
      .leftJoinAndSelect("stock.products", "products")
      .leftJoinAndSelect("stock.fishpond", "ponds")
      .select([
        "repeat.id",
        "repeat.date_start",
        "repeat.user_id",
        "repeat.note",
        "repeat.repeat_date",
        "repeat.manage_status",
        "repeat.notification_status",
        "repeat.createdAt",
        "repeat.updatedAt",
        "catgory.event_status",
        "stock.fish_repeat_id",
        "stock.fishgroup_id",
        "stock.product_id",
        "stock.pond_id",
        "products.id",
        "products.sku",
        "ponds.fish_pond_id",
      ])
      .where(`repeat.date_schedules BETWEEN '${start}' AND '${end}'`)
      .orWhere("repeat.manage_status = :manage_status", {
        manage_status: manage_status,
      })
      .orderBy("repeat.priority", "ASC")
      .addOrderBy("repeat.date_schedules", "ASC")
      .getMany();
    // const result = await db
    //   .getRepository(Fishschedulestock)
    //   .createQueryBuilder("fishschedulestock")
    //   .leftJoinAndSelect("fishschedulestock.fishschedules", "fishschedules")
    //   .leftJoinAndSelect("fishschedulestock.products", "products")
    //   .leftJoinAndSelect("products.fishpond", "fishpond")
    //   .where(`fishschedules.date_schedules BETWEEN '${start}' AND '${end}'`)
    //   .andWhere("fishschedules.manage_status = :manage_status", {
    //     manage_status: manage_status,
    //   })
    //   .getMany();

    if (!result) return res.status(400).json({ message: "no data body in your request" });

    res.json(result);
  },
  addEventStatus: async (req: Request, res: Response) => {
    const object: { event_status: string } = req.body;

    const addEvent = new SchedulesCategory();
    addEvent.event_status = object.event_status;
    addEvent.createdAt = new Date();
    addEvent.updatedAt = new Date();

    await db.getRepository(SchedulesCategory).save(addEvent);

    res.json({ status: true, message: "เพิ่มข้อมูลสำเร็จแล้ว" });
  },

  getEventStatus: async (req: Request, res: Response) => {
    const result = await db.getRepository(SchedulesCategory).find({});

    res.json({ status: true, data: result });
  },
  add: async (req: Request, res: Response) => {
    const data: {
      schedules_cate_id: number;
      manage_status: string;
      product_id: Array<number>;
      pond_id: Array<number>;
      group_id: Array<number>;
      date_start: Date;
      date_schedules: Date;
      repeat_date: number;
      note: string;
    } = req.body;

    const addRepeat = new FishschedulesRepeat();
    const addLog = new Fishscheduleslog();

    let repeat_date: Date;

    if (req.body.repeat_date != null) {
      repeat_date = moment(data.date_schedules).add(-7, "hour").add(data.repeat_date, "day").toDate();
    }

    const priority = await util.manageStatusRepeat(data.manage_status);

    addRepeat.schedules_cate_id = data.schedules_cate_id;
    addRepeat.date_start = moment().toDate();
    addRepeat.date_schedules = moment(data.date_schedules).add(-7, "hour").toDate();
    addRepeat.repeat_date = repeat_date!;
    addRepeat.manage_status = data.manage_status;
    addRepeat.priority = priority;
    addRepeat.notification_status = true;
    addRepeat.note = data.note;
    addRepeat.createdAt = new Date();
    addRepeat.updatedAt = new Date();

    //add schedules
    const repeat_id = await db.getRepository(FishschedulesRepeat).save(addRepeat);

    addLog.user_id = req.user?.id!;
    addLog.fish_repeat_id = repeat_id.id;
    addLog.manage_status = data.manage_status;
    addLog.note = data.note;
    addLog.createdAt = new Date();
    addLog.updatedAt = new Date();
    await db.getRepository(Fishscheduleslog).save(addLog);

    //add schedules stock

    if (data.product_id != null) {
      for (let i = 0; i < data.product_id.length; i++) {
        const element = data.product_id[i];

        await db
          .createQueryBuilder()
          .insert()
          .into(Fishschedulestock)
          .values([{ fish_repeat_id: repeat_id.id, product_id: element }])
          .execute();
      }
    }

    if (data.pond_id != null) {
      for (let j = 0; j < data.pond_id.length; j++) {
        const element = data.pond_id[j];
        await db
          .createQueryBuilder()
          .insert()
          .into(Fishschedulestock)
          .values([{ fish_repeat_id: repeat_id.id, pond_id: element }])
          .execute();
      }
    }

    if (data.group_id != null) {
      for (let j = 0; j < data.group_id.length; j++) {
        const element = data.group_id[j];
        await db
          .createQueryBuilder()
          .insert()
          .into(Fishschedulestock)
          .values([{ fish_repeat_id: repeat_id.id, fishgroup_id: element }])
          .execute();
      }
    }

    //add schedulecount

    const result = await db.getRepository(FishschedulesRepeat).findOneBy({ id: repeat_id.id });

    res.status(200).json({ status: true, data: result });
  },

  schedulesTest: async (req: Request, res: Response) => {
    const fish_repeat_id = Number(req.query.fish_repeat_id);
    const manage_status = req.query.manage_status as string;
    const note = req.query.note as string;

    if (fish_repeat_id == 0) {
      return res.json({ status: false, message: "โปรดระบุไอดีแจ้งเตือนของคุณ" });
    }

    if (fish_repeat_id) {
      const findSchedulesRepeat = await db.getRepository(FishschedulesRepeat).findOneBy({ id: fish_repeat_id });

      // return res.json(findSchedulesRepeat)
      if (!findSchedulesRepeat) return res.json({ status: false, message: "คุณไม่มีไอดีการแจ้งเตือนทำซ้ำนี้" });
      if (findSchedulesRepeat && findSchedulesRepeat.manage_status !== "สำเร็จ") {
        const priority = await util.manageStatusRepeat(manage_status);

        if (findSchedulesRepeat!.repeat_date === null && manage_status === "สำเร็จ")
          return await util.manageStatusUpdateSuccessRepeat(findSchedulesRepeat, priority, manage_status, note, res);

        if (
          findSchedulesRepeat.repeat_date === null ||
          (findSchedulesRepeat.repeat_date !== null && manage_status === "กำลังดำเนินการ")
        )
          return await util.manageStatusInProgressRepeat(findSchedulesRepeat, priority, manage_status, note, res);

        if (
          findSchedulesRepeat.repeat_date === null ||
          (findSchedulesRepeat.repeat_date !== null && manage_status === "รอดำเนินการ")
        )
          return await util.manageStatusPending(findSchedulesRepeat, priority, manage_status, note, res);

        await util.checkRepeatSchedulesDate(findSchedulesRepeat, priority, manage_status, note, res);
      }
    }

    // res.json({ status: false, message: "คุณไม่ควรเปลี่ยนสถานะเวลาที่สำเร็จไปแล้ว" });
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

  logSchedulesRepeat: async (req: Request, res: Response) => {
    const fishschedulesRepeatId = Number(req.query.fishschedulesRepeatId);
    const result = await db.getRepository(Fishscheduleslog).find({ where: { fish_repeat_id: fishschedulesRepeatId } });

    if (result.length == 0) {
      res.status(200).json({ status: false, message: "ไม่พบข้อมูล" });
    }

    res.status(200).json({ status: true, data: result });
  },

  update: async (req: TypedRequestBody<Schedules>, res: Response) => {
    const dataId = await db.getRepository(SchedulesCategory).findOne({
      where: { id: Number(req.body.id) },
    });

    if (!dataId) return res.status(400).json({ message: "Not found data" });

    // dataId.event_status = req.body.event_status;
    // dataId.date_schedules = req.body.date_schedules;
    // dataId.status = req.body.status;

    await db.getRepository(SchedulesCategory).save(dataId);
  },
  delete: async (req: Request, res: Response) => {
    await db.getRepository(FishschedulesRepeat).delete({ id: Number(req.params.id) });

    res.status(200).json({ success: true });
  },
};

export default fishschedulesController;
