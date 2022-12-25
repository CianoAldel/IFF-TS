import { NextFunction, Request, Response } from "express";

const authenticationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  console.log("middleware req.user", req.user);

  if (req.isAuthenticated()) {
    return next();
  }
  res.send("คุณยังไม่ได้ทำการเข้าสู่ระบบ โปรดเข้าสู่ระบบก่อนใช้งาน");
};

export = authenticationMiddleware;
