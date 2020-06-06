import { Request, Response } from "express";
import knex from "../database/connection";

class ItemsController {
  async index(req: Request, res: Response) {
    const items = await knex("items").select("*");

    const serializedItems = items.map((item) => {
      return {
        id: item.id,
        title: item.title,
        // url_image: `http://localhost:3333/uploads/items/${item.image}`, // Web
        url_image: `http://192.168.1.8:3333/uploads/items/${item.image}`, // Mobile
      };
    });

    return res.json(serializedItems);
  }
}

export default new ItemsController();
