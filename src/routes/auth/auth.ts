import { NextFunction, Router } from "express";
const router = Router();
import passport = require("passport");
import { Request, Response } from "express";
import axios from "axios";
import qs from "qs";
import "dotenv/config";

const CLIENT_URL = "http://localhost:3000/";

//checkNotAuthenticated || checkAuthenticated

let code: string;
let token: string;

router.get("/login/success", (req: Request, res: Response) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "successfull",
      user: req.user,
    });
  }
});

router.get("/login/failed", (req: Request, res: Response) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
});

router.get("/logout", (req: Request, res: Response, next: NextFunction) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect(CLIENT_URL);
  });
});

router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { successRedirect: CLIENT_URL, failureRedirect: "/login/failed" })
);

router.get("/facebook", passport.authenticate("facebook", { scope: ["public_profile"] }));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { successRedirect: CLIENT_URL, failureRedirect: "/login/failed" })
);

router.get("/line/login/page", (req: Request, res: Response) => {
  const loginUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${process.env.LINE_CLIENT_ID}&redirect_uri=http://localhost:5001/authorization/line/callback&state=12345abcde&scope=profile%20openid&nonce=09876xyz`;
  res.redirect(loginUrl);
});

router.get("/line/callback", (req: Request, res: Response) => {
  code = req.query.code as string;
  res.redirect("/authorization/line/token");
});

router.get("/line/token", (req: Request, res: Response) => {
  axios
    .post(
      "https://api.line.me/oauth2/v2.1/token",
      qs.stringify({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: "http://localhost:5001/authorization/line/callback",
        client_id: process.env.LINE_CLIENT_ID,
        client_secret: process.env.LINE_CLIENT_SECRET,
      }),
      {
        headers: {
          "content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      }
    )
    .then((response) => {
      token = response.data.id_token;
      res.redirect("/authorization/line/verify");
    })
    .catch((err) => {
      res.json(err);
    });
});

router.get("/line/verify", (req: Request, res: Response) => {
  axios
    .post(
      "https://api.line.me/oauth2/v2.1/verify",
      qs.stringify({
        id_token: token,
        client_id: process.env.LINE_CLIENT_ID,
      }),
      {
        headers: {
          "content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      }
    )
    .then((response) => {
      //insert to database
      res.json(response.data);
    })
    .catch((err) => {
      res.json(err);
    });
});

export default router;
