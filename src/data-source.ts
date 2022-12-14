import "reflect-metadata";
import { DataSource } from "typeorm";
import { join } from "path";

const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "",
  database: "interkoi_db",
  entities: [join(__dirname, "/entities/*.ts")],
  synchronize: false,
  logging: true,
});

AppDataSource.initialize()
  .then(() => {
    console.log("connected");
  })
  .catch((error) => {
    console.log(error);
  });

export default AppDataSource;
