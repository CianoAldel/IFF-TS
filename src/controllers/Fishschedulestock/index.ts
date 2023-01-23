import db from "../../data-source";
import { TypedRequestBody } from "../../interface/TypedRequest";
import { Schedules } from "../../interface/FishSchedules";
import { SchedulesCategory } from "../../entities/Schedulescategory";
import moment from "moment";
import { Fishschedulestock } from "../../entities/Fishschedulestock";
import { Request, Response, query } from "express";

const fishscheduleStockController = {
  show: async (req: Request, res: Response) => {
    //รับ query กับ body

    // if (req.query.manage_status != null && req.query.status != null) {
    const result = await db
      .getRepository(Fishschedulestock)
      .createQueryBuilder("fishschedulestock")
      .leftJoinAndSelect("fishschedulestock.fishschedules", "fishschedules")
      .leftJoinAndSelect("fishschedulestock.fishschedulesrepeat", "fishschedulesrepeat")
      .getMany();

    if (!result) return res.status(400).json({ message: "no status in your request" });

    res.json(result);
  },
};

export default fishscheduleStockController;
