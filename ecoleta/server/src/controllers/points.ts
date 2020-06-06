import { Request, Response } from "express";
import knex from "../database/connection";

function addUrlImage(point: any) {
  const host = "192.168.1.8"; // Mobile
  // const host = "localhost"; // Web
  return ({ ...point, image: `http://${host}:3333/uploads/points/${point.image}` });
}

class PointsController {
  async index(req: Request, res: Response) {
    const { city, uf, items } = req.query;

    const items_ = String(items)
      .split(",")
      .map((i) => Number(i.trim()));

    const points = await knex("points")
      .join("point_items", "points.id", "=", "point_items.point_id")
      .whereIn("point_items.item_id", items_)
      .where("city", String(city))
      .where("uf", String(uf))
      .distinct()
      .select("points.*");

    return res.json(points.map(addUrlImage));
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;

    const point = addUrlImage(await knex("points").where("id", id).first());

    if (!point) return res.status(404).json({ message: "Point not found" });

    const items = await knex("items")
      .join("point_items", "items.id", "=", "point_items.item_id")
      .where("point_items.point_id", id)
      .select("items.title");

    return res.json({ point, items });
  }

  async store(req: Request, res: Response) {
    const { items, point } = req.body;
    point.image = "no-image";

    const trx = await knex.transaction();

    const [point_id] = await trx("points").insert(point);

    const pointItems = items.map((item_id: number) => ({ item_id, point_id }));

    await trx("point_items").insert(pointItems);

    await trx.commit();

    return res.json({ id: point_id, ...point });
  }

  async delete(req: Request, res: Response) {
    const id = Number(req.params.id);

    const trx = await knex.transaction();

    await trx("point_items").where("point_id", id).del();
    const deletedPoints = await trx("points").where("id", id).del();

    if (deletedPoints !== 1) {
      await trx.rollback();
      return res.status(404).json({ message: "Point not found" });
    }

    await trx.commit();

    return res.json({ id });
  }

  async upload(req: Request, res: Response) {
    const id = Number(req.params.id);

    await knex("points").update({ image: req.file.filename }).where("id", id);

    return res.json({ success: true });
  }
}

export default new PointsController();
