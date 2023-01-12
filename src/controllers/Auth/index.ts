import express, { Request, Response } from "express";
import db from "../../data-source";
import bcrypt from "bcrypt";
import { Users } from "../../entities/Users";
import passport = require("passport");

declare module "express-session" {
  export interface SessionData {
    user: { [key: string]: any };
  }
}

const authController = {
  logout: async (req: Request, res: Response) => {
    req.session.destroy((err) => {
      console.log(err);
    });
    res
      .status(200)
      .json({
        isLoggedIn: false,
      })
      .end();
  },
  me: async (req: Request, res: Response) => {
    const user = req.session.user;
    res
      .json({
        isLoggedIn: true,
        user,
      })
      .end();
  },
  register: async (req: Request, res: Response) => {
    try {
      const objects: { username: string; password: string; displayName: string; role: string } = req.body;

      const created = await db.getRepository(Users).findOne({
        where: {
          username: objects.username,
        },
      });

      if (created) {
        return res.status(422).json({ message: "มีชื่อผู้ใช้งานนี้แล้วในระบบ" });
      }

      const user = new Users();
      const salt = bcrypt.genSaltSync();
      user.username = objects.username;
      user.password = bcrypt.hashSync(objects.password, salt);
      user.displayName = objects.displayName;
      user.role = objects.role;
      user.createdAt = new Date();
      user.updatedAt = new Date();

      await db.getRepository(Users).save(user);

      const data = await db.getRepository(Users).findOne({
        where: {
          username: objects.username,
        },
      });

      res.status(200).json(data);
    } catch (error) {
      console.log(error);
    }
  },
};

export default authController;
