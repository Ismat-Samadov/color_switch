import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

// Create database connection only when DATABASE_URL is available
const createConnection = () => {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not defined. Please set it in your environment variables."
    );
  }

  const sql = neon(connectionString);
  return drizzle(sql, { schema });
};

// Export db that initializes lazily
let dbInstance: ReturnType<typeof createConnection> | undefined;

export const db = new Proxy({} as ReturnType<typeof createConnection>, {
  get: (_, property) => {
    if (!dbInstance) {
      dbInstance = createConnection();
    }
    return (dbInstance as any)[property];
  },
});
