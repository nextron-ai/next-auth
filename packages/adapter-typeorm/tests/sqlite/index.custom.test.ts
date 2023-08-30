import { runBasicTests } from "../../../adapter-test"
import { TypeORMAdapter } from "../../src"
import * as entities from "../custom-entities"
import { db } from "../helpers"

const sqliteConfig = {
  type: "sqlite" as const,
  name: "next-auth-test-memory",
  database: "./tests/sqlite/dev.db",
  synchronize: true,
}

runBasicTests({
  adapter: TypeORMAdapter(sqliteConfig, {
    entities,
  }),
  db: db(sqliteConfig, entities),
})
