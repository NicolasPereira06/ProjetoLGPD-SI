import { Pool } from "pg";

const DB = new Pool({
    connectionString: "postgres://sfnrsfac:HEN6Pe--qX857xZ5CR6j3Bqp7JLxFmsE@isabelle.db.elephantsql.com/sfnrsfac"
});

export default DB;