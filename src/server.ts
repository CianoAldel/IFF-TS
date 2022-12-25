import "dotenv/config";
// @ts-ignore
import express from "express";
import routes from "./routes";
const app = express();
const PORT = process.env.PORT || 5001;
import passport = require("passport");
import sessions = require("express-session");
import { Server } from "socket.io";
import http from "http";
import cookieParser = require("cookie-parser");
const server = http.createServer(app);
import cors from "cors";
import "./passport.setting";

const io = new Server(server, { cors: { origin: "*" } });

app.set("origins", "*:*");

// const corsOptions = {
//   origin: "*",
//   credentials: true, //access-control-allow-credentials:true
//   optionSuccessStatus: 200,
// };
// app.use(cors(corsOptions));

app.use(
  sessions({
    name: "INTER KOI FARM",
    secret:
      "9cd69957c13cf9a5abc1dce3bbec21f7159998964455fbcc60eabe598a43d0b99bc24e6a8a9714a3c336314f27db18e0b888463aaa5075929e215e6d05d813e0",
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 14000 },
    resave: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", routes);

io.on("connection", () => {
  console.log("user a connection");
});

server.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
