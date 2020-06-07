import DataLoader from "dataloader";

class Loader {
  constructor(private ctx: any) {}

  items = new DataLoader((ids) => {
    const ids_ = ids.map((id) => Number(id));
    return this.ctx.knex("items").whereIn("id", ids_).select("*");
  });

  points = new DataLoader((ids) => {
    const ids_ = ids.map((id) => Number(id));
    return this.ctx.knex("points").whereIn("id", ids_).select("*");
  });
}

export function loader(ctx: any) {
  if (ctx._loader) return ctx._loader;
  ctx._loader = new Loader(ctx);
  return ctx._loader;
}
