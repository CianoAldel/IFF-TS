import { Request, Response } from "express";

import db from "../../data-source";
import { Categories } from "../../entities/Categories";

const categoryController = {
  index: async (req: Request, res: Response) => {
    const { type } = req.params;
    const categories = await db.getRepository(Categories).find({
      where: {
        type: type,
      },
    });
    res.json(categories);
  },

  categories: async (req: Request, res: Response) => {
    const categories = await db
      .getRepository(Categories)
      .createQueryBuilder("categories")
      .where("type = :type", { type: "species" })
      .select(["id AS value", "name AS label"])
      .getRawMany();

    //value = id ของ categories ที่จะส่งมาให้
    //label = name ที่จะเอาไปแสดงผล

    let array: Array<any | number> = [];

    categories.map((element, index) => {
      const result = {
        id: index + 1,
        value: element.value,
        label: element.label,
      };
      array.push(result);
    });

    res.json(array);
  },
  store: async (req: Request, res: Response) => {
    const body: { name: string; type: string } = req.body;

    const store = new Categories();
    store.name = body.name;
    store.type = body.type;

    const data = await db.getRepository(Categories).save(store);

    res.json({ status: true });
  },
};

export default categoryController;
