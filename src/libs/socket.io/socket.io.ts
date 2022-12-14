import * as SocketType from "./interface/socket.io.interface";
import { Server } from "socket.io";

const io = new Server<
  SocketType.ClientToServerEvents,
  SocketType.ServerToClientEvents,
  SocketType.InterServerEvents,
  SocketType.PayLoadData
>();

export { io };
