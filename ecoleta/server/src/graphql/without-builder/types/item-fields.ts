import {
  GraphQLNonNull,
  GraphQLInt,
  GraphQLString,
} from "graphql";

export const ItemFields = {
  id: { type: new GraphQLNonNull(GraphQLInt) },
  image: { type: new GraphQLNonNull(GraphQLString) },
  title: { type: new GraphQLNonNull(GraphQLString) },
};
