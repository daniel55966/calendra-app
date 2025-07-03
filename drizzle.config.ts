// 🔍 Get the database URL from environment variables
const databaseUrl = process.env.DATABASE_URL;

// ❌ If the database URL is not defined, throw an error to prevent misconfiguration
if (!databaseUrl) {
  throw new Error("❌ DATABASE_URL is not defined in environment variables.");
}

// ✅ Export the Drizzle config as a plain object
export default {
  // 📁 Path to your schema definitions (Drizzle ORM will scan this file)
  schema: "./drizzle/schema.ts",

  // 🗃️ Directory where Drizzle will output migration files
  out: "./drizzle/migrations",

  // 🧠 Specify which SQL dialect you're using (e.g., PostgreSQL, MySQL)
  dialect: "postgresql",

  // 🔒 Enable strict mode to enforce stricter validation and type-safety
  strict: true,

  // 🗯️ Enable verbose logging to get more information during CLI actions
  verbose: true,

  // 🔐 Pass in database credentials (like connection URL)
  dbCredentials: {
    url: databaseUrl,
  },
};
