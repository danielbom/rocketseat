import { Router } from "express";
import graphqlHTTP from "express-graphql";
import schema from "./schema";

import resolvers from "../resolvers";
import { loader } from "../loader";
import knex from "../../database/connection";

const router = Router();

router.use(
  "/",
  graphqlHTTP({
    schema,
    graphiql: true,
    fieldResolver: resolvers.fieldResolver(resolvers),
    context: {
      knex,
      loader,
    },
  })
);

export default router;
