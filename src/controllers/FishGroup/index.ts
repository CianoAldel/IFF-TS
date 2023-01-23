import { Request, Response } from "express";

import db from "../../data-source";
import { Productimages } from "../../entities/Productimages";
import { IsNull, LessThanOrEqual, Like, MoreThan } from "typeorm";
import { TypedRequestBody } from "../../interface/TypedRequest";
import moment from "moment";
import { Fishgroup } from "../../entities/Fishgroup";

import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse";
import { Products } from "../../entities/Products";

type Fish = {
  farm: string;
  species: string;
  bloodline: string;
  birthday: string;
  age: string;
  gender: string;
  import_date: string;
  size: string;
  price_buy: string;
  price_sell: string;
  pond_id: string;
  note: string;
};

const fishGroupController = {
  insertFishFileCSV: async (req: Request, res: Response) => {
    // console.log(req.files!.fishGroupFile![0].filename);

    const csvFilePath = path.resolve(`public/storage/fishgroup_file/${req.files!.fishGroupFile![0].filename}`);

    const addGroupFish = new Fishgroup();
    addGroupFish.group_name = req.body.name_group;
    addGroupFish.filename = req.files!.fishGroupFile![0].filename;
    addGroupFish.type = "file";
    addGroupFish.createdAt = new Date();
    addGroupFish.updatedAt = new Date();

    const { id } = await db.getRepository(Fishgroup).save(addGroupFish);

    const headers = [
      "farm",
      "species",
      "bloodline",
      "birthday",
      "age",
      "gender",
      "import_date",
      "size",
      "price_buy",
      "price_sell",
      "pond_id",
      "note",
    ];

    const fileContent = fs.readFileSync(csvFilePath, { encoding: "utf-8" });

    parse(
      fileContent,
      {
        delimiter: ",",
        columns: headers,
      },
      async (error, data: Fish[]) => {
        if (error) {
          console.error(error);
        }
        const addFish = new Products();
        data.map(async (result) => {
          addFish.group_id = id;
          addFish.farm = result.farm;
          addFish.name = result.species;
          addFish.bloodline = result.bloodline;
          addFish.birthday = new Date(result.birthday);
          addFish.age = result.age;
          addFish.gender = result.gender;
          addFish.import_date = new Date(result.import_date);
          addFish.size = result.size;
          addFish.price_sell = Number(result.price_sell);
          addFish.price_buy = Number(result.price_buy);
          addFish.createdAt = new Date();
          addFish.updatedAt = new Date();
          // addFish.pond_id = Number(result.pond_id);
          addFish.note = result.note;

          await db.getRepository(Products).save(addFish);
        });
      }
    );
    res.json({ status: true, message: "เพิ่มข้อมูลปลาทั้งหมดเสร็จสิ้น" });
  },
  get: async (req: Request, res: Response) => {
    const result = await db.getRepository(Fishgroup).find();

    if (result.length == 0) {
      res.json({ status: true, message: "ไม่พบข้อมูล" });
    }

    res.json({ status: true, data: result });
  },

  getById: async (req: Request, res: Response) => {
    console.log(req.params);

    const result = await db.getRepository(Fishgroup).findOneBy({ id: Number(req.params.id) });

    if (!result) {
      res.json({ status: true, message: "ไม่พบข้อมูลไอดีนี้" });
    }

    res.json({ status: true, data: result });
  },
};

export default fishGroupController;
