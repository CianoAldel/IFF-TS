const { getToken } = require("next-auth/jwt");
import { NextFunction, Request, Response } from "express";
require("dotenv").config();

const auth = async (req: Request, res: Response, next: NextFunction) => {
  const auth = await getToken({ req, secret: process.env.JWT_SECRET });

  if (!auth) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  req.user = auth.user;
  next();
};
module.exports = auth;
