import { GraphQLObjectType } from "graphql";

import PointMutations from "./point";

export default new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    storePoint: PointMutations
  }),
});
