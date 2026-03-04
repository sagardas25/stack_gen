import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/prisma-db/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const db =
  globalThis.prisma ||
  new PrismaClient({
  adapter,
  });

if (process.env.NODE_ENV == "development") {
  globalThis.prisma = db;
}

export default db;
