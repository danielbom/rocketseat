import {
  GraphQLNonNull,
  GraphQLInt,
  GraphQLString,
  GraphQLFloat,
} from "graphql";

export const PointFields = {
  id: { type: new GraphQLNonNull(GraphQLInt) },
  image: { type: new GraphQLNonNull(GraphQLString) },
  name: { type: new GraphQLNonNull(GraphQLString) },
  email: { type: new GraphQLNonNull(GraphQLString) },
  whatsapp: { type: new GraphQLNonNull(GraphQLString) },
  latitude: { type: new GraphQLNonNull(GraphQLFloat) },
  longitude: { type: new GraphQLNonNull(GraphQLFloat) },
  city: { type: new GraphQLNonNull(GraphQLString) },
  uf: { type: new GraphQLNonNull(GraphQLString) },
};
