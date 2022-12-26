import { NextFunction, request, Router } from "express";
const router = Router();
import passport = require("passport");
import { Request, Response } from "express";
import axios from "axios";
import qs from "qs";
import "dotenv/config";
import db from "../../data-source";
import { Users } from "../../entities/Users";
import { Accounts } from "../../entities/Accounts";
const CLIENT_URL = "http://localhost:3000";

declare global {
  namespace Express {
    interface User {
      id: number;
      username: string;
      displayName: string;
      name: string;
      password: string;
      role: string;
      createdAt: Date;
      updatedAt: Date;
      email: string;
      email_verified: Date;
      image: string;
      bidder: string;
    }
  }
}

//assign req.user

// let dataUser: Express.User;

// router.use((req, res, next) => {
//   console.log("set to middleware", req.user);
//   req.user = data;
//   next();
// });

const scope = "profile%20openid%20email"; //line scope

let code: string;
let token: string;

//success login
router.get("/login/success", (req: Request, res: Response) => {
  console.log("req.user", req.user);

  if (req.user) {
    res.status(200).json({
      success: true,
      message: "successfull",
      user: req.user,
    });
  }
});

//failed login
router.get("/login/failed", (req: Request, res: Response) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
});

//logout
router.get("/logout", async (req: Request, res: Response, next: NextFunction) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
  });

  res.redirect(`${CLIENT_URL}`); //client domain
});

// send to google login
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// callback data form google login
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/authorization/login/failed" }),
  (req: Request, res: Response, next: NextFunction) => {
    // const data = req.user;
    res.redirect("/authorization/login/success");
  }
);

// send to facebook login
router.get("/facebook", passport.authenticate("facebook", { scope: ["public_profile", "email"] }));

// callback data form facebook login
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/authorization/login/failed" }),
  (req, res, next) => {
    // res.redirect(CLIENT_URL); //return callback ไปที่ domain
    res.redirect("/authorization/login/success");
  }
);

//go to login page line
router.get("/line/login/page", (req: Request, res: Response) => {
  const loginUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${process.env.LINE_CLIENT_ID}&redirect_uri=http://localhost:5001/authorization/line/callback&state=12345abcde&scope=${scope}&nonce=09876xyz`;
  res.redirect(loginUrl);
});

//callback code for get token line
router.get("/line/callback", (req: Request, res: Response) => {
  code = req.query.code as string;
  res.redirect("/authorization/line/token");
});

//sign token
router.get("/line/token", (req: Request, res: Response) => {
  axios
    .post(
      "https://api.line.me/oauth2/v2.1/token",
      qs.stringify({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: "http://localhost:5001/authorization/line/callback", // callback uri line developer
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

//verify token line
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
    .then(async (response) => {
      //insert to database
      const data = response.data;

      await db
        .getRepository(Users)
        .findOne({ where: { name: data.name } })
        .then(async (result) => {
          if (!result) {
            const users = new Users();
            users.name = data.name;
            users.role = "user";
            users.createdAt = new Date();
            users.updatedAt = new Date();
            users.email = data.email;
            users.image = data.image;
            // users.bidder = "";

            const user = await db.getRepository(Users).save(users);
            console.log("save user");

            const accounts = new Accounts();
            accounts.type = "oauth";
            accounts.provider = "line";
            accounts.provider_account_id = data.sub;
            accounts.refresh_token = "";
            accounts.access_token = "";
            accounts.expires_at = data.exp;
            accounts.token_type = "Bearer";
            accounts.scope = "profile,email";
            accounts.id_token = token; //token need length data in field data
            accounts.user_id = user.id.toString();
            accounts.createdAt = new Date();
            accounts.updatedAt = new Date();

            await db.getRepository(Accounts).save(accounts);

            // dataUser = user;
            res.redirect("/authorization/login/success");
          }
          // dataUser = result!;
        });
      res.redirect("/authorization/login/success");
    })
    .catch((err) => {
      res.json(err);
    });
});

export default router;
