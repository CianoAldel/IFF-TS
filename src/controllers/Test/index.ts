import { Request, Response } from "express";

import db from "../../data-source";

// import * as utils from "../PaymentController/utils/index";
import { Users } from "../../entities/Users";
import { Userinfos } from "../../entities/Userinfos";

const testController = {
  index: async (req: Request, res: Response) => {
    const user = await db
      .createQueryBuilder(Users, "user")
      .innerJoin(Userinfos, "userinfos", "user.id = userinfos.user_id")
      .where("user.id = :id", { id: req.query.id })
      .getOne();

    res.json(user);
  },
};

export default testController;
