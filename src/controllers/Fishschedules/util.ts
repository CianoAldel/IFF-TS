import db from "../../data-source";
import { SchedulesCategory } from "../../entities/Schedulescategory";
import moment from "moment";
import { Fishschedulestock } from "../../entities/Fishschedulestock";
import { FishschedulesRepeat } from "../../entities/Fishschedulesrepeat";
import { Fishscheduleslog } from "../../entities/Fishscheduleslog";

import { Request, Response } from "express";
import { Products } from "../../entities/Products";
import { Fishpond } from "../../entities/Fishpond";
import { Fishgroup } from "../../entities/Fishgroup";

//FishschedulesRepeat
export async function manageStatusRepeat(manage_status: string) {
  let priority: number;
  switch (manage_status) {
    case "สำเร็จ":
      priority = 3;
      break;

    case "กำลังดำเนินการ":
      priority = 2;
      break;

    case "รอดำเนินงาน":
      priority = 1;
      break;
  }
  return priority!;
}

export async function checkRepeatSchedulesDate(
  findSchedules: FishschedulesRepeat,
  priority: number,
  manage_status: string,
  note: string,
  res: Response
) {
  const currentDate = new Date();
  //save fishscheduleslog

  if (
    findSchedules!.repeat_date! >= currentDate && //more then currentDate
    findSchedules!.repeat_date !== null &&
    manage_status == "สำเร็จ"
  ) {
    //convert repeat_date to date and find day

    await saveChangeStatusFishSchedulesRepeat(findSchedules, manage_status, note, priority);
    const date = new Date(findSchedules!.repeat_date).getDate() - new Date(findSchedules!.date_schedules).getDate();
    const repeat_date = moment(findSchedules?.repeat_date).add(date, "day").toDate();
    const oldRepeatDate = findSchedules.repeat_date;
    const schedulesRepeat = await insertFishschedulesRepeat(
      findSchedules.schedules_cate_id,
      oldRepeatDate,
      repeat_date,
      note,
      findSchedules
    );
    await insertFishscheduleStock(schedulesRepeat.id);
    await insertFishschedulesLog(schedulesRepeat);

    const result = await db.getRepository(FishschedulesRepeat).findOneBy({ id: schedulesRepeat.id });
    return res.status(200).json({ success: true, data: result });
  } else if (
    findSchedules.repeat_date <= currentDate && //less then currentDate
    findSchedules.repeat_date !== null &&
    manage_status == "สำเร็จ"
  ) {
    await saveChangeStatusFishSchedulesRepeat(findSchedules, manage_status, note, priority);
    const date = new Date(findSchedules!.repeat_date).getDate() - new Date(findSchedules!.date_schedules).getDate();
    const repeat_date = moment().add(date, "day").toDate();
    const oldRepeatDate = findSchedules.repeat_date;
    const schedulesRepeat = await insertFishschedulesRepeat(
      findSchedules.schedules_cate_id,
      repeat_date,
      oldRepeatDate,
      note,
      findSchedules!
    );
    await insertFishscheduleStock(schedulesRepeat.id);
    await insertFishschedulesLog(schedulesRepeat);

    const result = await db.getRepository(FishschedulesRepeat).findOneBy({ id: schedulesRepeat.id });
    return res.status(200).json({ success: true, data: result });
  }

  res.status(400).json({ success: false, data: "อัพเดทสถานะ ล้มเหลว" });
}

async function insertFishschedulesRepeat(
  event_status: number,
  oldRepeatDate: Date,
  repeat_date: Date,
  note: string,
  findSchedules: FishschedulesRepeat
) {
  const addRepeat = new FishschedulesRepeat();

  addRepeat.schedules_cate_id = event_status;
  addRepeat.date_start = moment().toDate();
  addRepeat.date_schedules = oldRepeatDate;
  addRepeat.repeat_date = repeat_date;
  addRepeat.status = findSchedules!.status;
  addRepeat.status = findSchedules!.status;
  addRepeat.manage_status = "รอดำเนินการ";
  addRepeat.note = note;
  addRepeat.priority = 1;
  addRepeat.createdAt = new Date();
  addRepeat.updatedAt = new Date();

  const data = await db.getRepository(FishschedulesRepeat).save(addRepeat);

  return data;
}

async function saveChangeStatusFishSchedulesRepeat(
  findSchedules: FishschedulesRepeat,
  manage_status: string,
  note: string,
  priority: number
) {
  findSchedules.note = note;
  findSchedules.manage_status = manage_status;
  findSchedules.priority = priority!;
  const { id } = await db.getRepository(FishschedulesRepeat).save(findSchedules);

  const addLog = new Fishscheduleslog();
  addLog.fish_repeat_id = id;
  addLog.manage_status = manage_status;
  addLog.note = note;
  addLog.createdAt = new Date();
  addLog.updatedAt = new Date();
  await db.getRepository(Fishscheduleslog).save(addLog);
}
export async function manageStatusUpdateSuccessRepeat(
  findSchedules: FishschedulesRepeat,
  priority: number,
  manage_status: string,
  note: string,
  res: Response
) {
  //check finish manage_status repeat_date have data
  await saveChangeStatusFishSchedulesRepeat(findSchedules, manage_status, note, priority);

  findSchedules.note = note;
  findSchedules.manage_status = manage_status;
  findSchedules.priority = priority!; //insert data fishschedules repeat
  await db.getRepository(FishschedulesRepeat).save(findSchedules);

  return res.status(200).json({ success: true, data: "อัพเดทสถานะ สำเร็จ แล้ว" });
}
export async function manageStatusInProgressRepeat(
  findSchedules: FishschedulesRepeat,
  priority: number,
  manage_status: string,
  note: string,
  res: Response
) {
  await saveChangeStatusFishSchedulesRepeat(findSchedules, manage_status, note, priority);

  findSchedules.manage_status = manage_status;
  findSchedules.note = manage_status;
  findSchedules.priority = priority;
  await db.getRepository(FishschedulesRepeat).save(findSchedules);

  return res.status(200).json({ success: true, data: "อัพเดทสถานะ กำลังดำเนินการ แล้ว" });
}

export async function manageStatusPending(
  findSchedules: FishschedulesRepeat,
  priority: number,
  manage_status: string,
  note: string,
  res: Response
) {
  await saveChangeStatusFishSchedulesRepeat(findSchedules, manage_status, note, priority);

  findSchedules!.manage_status = manage_status;
  findSchedules!.note = note;
  findSchedules.priority = priority;
  await db.getRepository(FishschedulesRepeat).save(findSchedules);

  return res.status(200).json({ success: true, data: "อัพเดทสถานะ รอดำเนินการ แล้ว" });
}
async function insertFishscheduleStock(fishschedulesRepeatId: number) {
  //fishschedulesId string = schedulesId.id
  // loop save array pondId and productId

  const findScheduleStock = await db.getRepository(Fishschedulestock).find({
    where: { fish_repeat_id: fishschedulesRepeatId },
  });

  for (let index = 0; index < findScheduleStock.length; index++) {
    const element = findScheduleStock[index].product_id;
    if (element !== null) {
      await db
        .createQueryBuilder()
        .insert()
        .into(Fishschedulestock)
        .values([{ fish_repeat_id: fishschedulesRepeatId, product_id: element }])
        .execute();
    }
  }

  for (let j = 0; j < findScheduleStock.length; j++) {
    const element = findScheduleStock[j].pond_id;
    if (element !== null) {
      await db
        .createQueryBuilder()
        .insert()
        .into(Fishschedulestock)
        .values([{ fish_repeat_id: fishschedulesRepeatId, pond_id: element }])
        .execute();
    }
  }
}

async function insertFishschedulesLog(fishschedulesRepeat: FishschedulesRepeat) {
  const addLogRepeat = new Fishscheduleslog();
  addLogRepeat.fish_repeat_id = fishschedulesRepeat.id;
  addLogRepeat.manage_status = fishschedulesRepeat.manage_status;
  addLogRepeat.note = fishschedulesRepeat.note;
  addLogRepeat.createdAt = new Date();
  addLogRepeat.updatedAt = new Date();

  await db.getRepository(Fishscheduleslog).save(addLogRepeat);
}

export async function removeNull(obj: any) {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([_, value]) => value != null)
      .map(([key, value]) => [key, value === Object(value) ? removeNull(value) : value])
  );
}
