import { Router } from "express";
import graphqlHTTP from "express-graphql";
import schema from "./schema";


import knex from "../../database/connection";
import { loader } from "../loader";
import resolvers from "../resolvers";

const router = Router();

router.use(
  "/",
  graphqlHTTP({
    schema,
    graphiql: true,
    fieldResolver: resolvers.fieldResolver(resolvers),
    context: { knex, loader },
  })
);

export default router;
