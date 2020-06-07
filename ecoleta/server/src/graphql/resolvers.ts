class Resolvers {
  private _resolvers: any = {
    query: {
      Point: {
        items: async (source: any, args: any, ctx: any) => {
          const ids = await ctx
            .knex("point_items")
            .where("point_id", source.id)
            .select("*");
          return ctx.loader(ctx).items.loadMany(ids.map((i: any) => i.item_id));
        },
      },
      Item: {
        points: async (source: any, args: any, ctx: any) => {
          const ids = await ctx
            .knex("point_items")
            .where("item_id", source.id)
            .select("*");
          return ctx
            .loader(ctx)
            .points.loadMany(ids.map((i: any) => i.point_id));
        },
      },
      points(args: any, ctx: any) {
        return ctx.knex("points").select("*");
      },
      items(args: any, ctx: any) {
        return ctx.knex("items").select("*");
      },
    },
    mutation: {
      async storePoint(args: any, ctx: any) {
        const { items, ...point } = args;
        point.image = "no-image";

        const trx = await ctx.knex.transaction();

        const [point_id] = await trx("points").insert(point);

        const pointItems = items.map((item_id: number) => ({
          item_id,
          point_id,
        }));

        await trx("point_items").insert(pointItems);

        await trx.commit();
        return { id: point_id, ...point };
      },
    },
  };

  private isRoot(info: any) {
    return info.path.prev === undefined;
  }
  private getResolver(info: any) {
    const op = info.operation.operation;
    return this._resolvers[op][info.fieldName];
  }
  private getInnerResolver(info: any) {
    const op = info.operation.operation;
    const parentType = info.parentType.toString();
    return this._resolvers[op][parentType][info.fieldName];
  }

  fieldResolver(resolvers: Resolvers) {
    return async (source: any, args: any, ctx: any, info: any) => {
      if (resolvers.isRoot(info))
        return resolvers.getResolver(info)(args, ctx, info);

      const resolver = resolvers.getInnerResolver(info);
      if (resolver) return resolver(source, args, ctx, info);

      return source[info.fieldName];
    };
  }
}

export default new Resolvers();
