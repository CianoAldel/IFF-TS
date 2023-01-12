import authController from "../../controllers/Auth";
import { NextFunction, Request, Response, Router } from "express";
const router = Router();
import passport = require("passport");

router.post("/login", function (req: Request, res: Response, next: NextFunction) {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.json({ message: info.message });
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.redirect("/authorization/login/success");
    });
  })(req, res, next);
});
router.post("/register", authController.register);
// router.post("/logout", authController.logout);

export default router;
