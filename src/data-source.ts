import "reflect-metadata";
import { DataSource } from "typeorm";
import { join } from "path";

// const AppDataSource = new DataSource({
//   type: "mysql",
//   host: "localhost",
//   port: 3306,
//   username: "root",
//   password: "",
//   database: "interkoi_db",
//   entities: [join(__dirname, "/entities/*.ts")],
//   synchronize: false,
//   logging: true,
// });

const AppDataSource = new DataSource({
  type: "mysql",
  host: "134.209.98.251",
  port: 3306,
  username: "interfish-root",
  password: "hA&1n12n",
  database: "interfish_db",
  entities: [join(__dirname, "/entities/*.ts")],
  synchronize: false,
  logging: true,
  timezone: "Z",
});

AppDataSource.initialize()
  .then(() => {
    console.log("connected");
  })
  .catch((error) => {
    console.log(error);
  });

export default AppDataSource;
