import { NextFunction, Request, Response } from "express";

const middleware = {
  auth: async (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.send("คุณยังไม่ได้ทำการเข้าสู่ระบบ โปรดเข้าสู่ระบบก่อนใช้งาน");
  },

  authSell: async (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role == "sellstaff") {
      if (req.isAuthenticated()) {
        return next();
      }
    }
    res.status(401).json({ message: "คุณไม่ได้รับสิทธิ์ให้แก้ไขข้อมูล" });
  },

  authFarm: async (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role == "farmstaff") {
      if (req.isAuthenticated()) {
        return next();
      }
    }
    res.status(401).json({ message: "คุณไม่ได้รับสิทธิ์ให้แก้ไขข้อมูล" });
  },
};

export = middleware;
