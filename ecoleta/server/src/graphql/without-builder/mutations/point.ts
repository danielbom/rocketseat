import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
} from "graphql";

import { PointFields } from "../types/point-fields";

export default {
  type: new GraphQLObjectType({
    name: "SimplePoint",
    fields: PointFields,
  }),
  args: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    whatsapp: { type: new GraphQLNonNull(GraphQLString) },
    latitude: { type: new GraphQLNonNull(GraphQLFloat) },
    longitude: { type: new GraphQLNonNull(GraphQLFloat) },
    city: { type: new GraphQLNonNull(GraphQLString) },
    uf: { type: new GraphQLNonNull(GraphQLString) },
    items: { type: new GraphQLList(GraphQLInt) },
  },
};
