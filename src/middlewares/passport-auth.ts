import { NextFunction, Request, Response } from "express";

const middleware = {
  auth: async (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role == "sellstaff" || req.user?.role == "admin" || req.user?.role == "superadmin") {
      if (req.isAuthenticated()) {
        return next();
      }
    }

    res.status(401).json({ status: false, message: "คุณไม่มีสิทธิ์ในการแก้ไขข้อมูล" });
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
