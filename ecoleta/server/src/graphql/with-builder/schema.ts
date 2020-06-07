import Fs from "fs";
import Path from "path";
import { makeExecutableSchema } from "graphql-tools";

const pathSchema = Path.join(__dirname, "schema.graphql");
const typeDefs = Fs.readFileSync(pathSchema).toString();

export default makeExecutableSchema({ typeDefs });
