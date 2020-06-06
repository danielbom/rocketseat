import knex from "knex";
import Path from "path";

export default knex({
  client: "sqlite3",
  connection: {
    filename: Path.resolve(__dirname, "db.sqlite"),
  },
  pool: {
    afterCreate(connection: any, done: any) {
      connection.run("PRAGMA foreign_keys = ON", done);
    }
  },
  useNullAsDefault: true
});
