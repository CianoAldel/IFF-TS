import { Router } from "express";
const routes = Router();

import index from "./index/index";
import auction from "./auction/index";
import category from "./category/index";
import dashboard from "./dashboard/index";
import auth from "./auth/index";
import authorization from "./auth/auth";
import product from "./product/index";
import species from "./species/index";
import storage from "./storage/index";
import user from "./user/index";
import member from "./member/index";
import test from "./test/index";
import fishgrow from "./fishgrow/index";
import fishschedulestock from "./fishschedulestock/index";
import fishhealth from "./fishhealth/index";
import fishpond from "./fishpond/index";
import fishschedules from "./fishschedules/index";
import fishgroup from "./fishgroup/index";

// import privilege from "./privilege/index";

// console.log("path", auth);

const defaultRoutes: string | any[] = [
  { route: "/", path: index },
  { route: "/auction", path: auction },
  { route: "/category", path: category },
  { route: "/dashboard", path: dashboard },
  { route: "/auth", path: auth },
  { route: "/authorization", path: authorization },
  { route: "/product", path: product },
  { route: "/species", path: species },
  { route: "/storage", path: storage },
  { route: "/user", path: user },
  { route: "/member", path: member },
  { route: "/fishgrow", path: fishgrow },
  { route: "/fishhealth", path: fishhealth },
  { route: "/fishpond", path: fishpond },
  { route: "/fishschedules", path: fishschedules },
  { route: "/fishschedulestock", path: fishschedulestock },

  { route: "/fishgroup", path: fishgroup },
  { route: "/test", path: test },
];

defaultRoutes.map((item) => {
  routes.use(item.route, item.path);
});

export default routes;
