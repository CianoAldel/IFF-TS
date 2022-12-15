import "dotenv/config";
// @ts-ignore
import cookieSession = require("cookie-session");
import express, { Application, Request, Response } from "express";
import routes from "./routes";
import * as sockets from "./libs/socket.io/socket.io";
const app: Application = express();
const PORT: string = process.env.PORT || "5001";
import "./passport.setting";
import passport = require("passport");
import sessions = require("express-session");

app.use(
  sessions({
    secret:
      "9cd69957c13cf9a5abc1dce3bbec21f7159998964455fbcc60eabe598a43d0b99bc24e6a8a9714a3c336314f27db18e0b888463aaa5075929e215e6d05d813e0",
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 14000 },
    resave: false,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", routes);

app.use(passport.initialize());
app.use(passport.session());

sockets.io.on("connect", (socket) => {
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("joinAuction", (payload) => {
    socket.join(payload.auctionId);
    console.log(payload);
  });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
