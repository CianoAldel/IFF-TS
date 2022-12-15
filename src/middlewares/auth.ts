import { NextFunction, Request, Response } from "express";
import db from "../data-source";
import { Users } from "../entities/Users";

const auth = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.session.user;

  if (!user) {
    req.session.destroy((err) => {
      console.log(err);
    });
    return res.status(401).json({
      isLoggedIn: false,
    });
  }

  const auth = await db.getRepository(Users).findOne({
    where: {
      id: user.id,
    },
  });

  console.log(auth);

  if (!auth) {
    req.session.destroy((err) => {
      console.log(err);
    });
    return res
      .status(401)
      .json({
        isLoggedIn: false,
      })
      .end();
  }

  req.user = auth;
  next();
};

export = auth;
