// src/config/db.ts
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config(); // MUST be first

const pool = new Pool({
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: String(process.env.DB_PASSWORD), // 🔑 FORCE STRING
});

export default pool;
