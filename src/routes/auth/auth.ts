import { NextFunction, Router } from "express";
const router = Router();
import passport = require("passport");
import { Request, Response } from "express";

const CLIENT_URL = "http://localhost:3000/";

//checkNotAuthenticated

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
  passport.authenticate("google", { successRedirect: CLIENT_URL, failureRedirect: "/login/failed" }, (req, res) => {
    console.log("test");
  })
);

router.get("/facebook", passport.authenticate("facebook", { scope: ["profile"] }));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);

router.get("/line/login/page", (req: Request, res: Response) => {
  const loginUrl =
    "https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=1657680081&redirect_uri=http://localhost:5001/authorization/line/callback&state=12345abcde&scope=profile%20openid&nonce=09876xyz";

  res.redirect(loginUrl);
});

router.get("/line/callback", (req: Request, res: Response) => {
  console.log(req.query.url);

  res.status(200).json({ status: true });
});

export default router;
