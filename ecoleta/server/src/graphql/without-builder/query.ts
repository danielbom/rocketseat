import { GraphQLObjectType, GraphQLList } from "graphql";

import { PointType, ItemType } from "./types";

export default new GraphQLObjectType({
  name: "Query",
  fields: () => ({
    items: { type: new GraphQLList(ItemType) },
    points: { type: new GraphQLList(PointType) },
  }),
});
