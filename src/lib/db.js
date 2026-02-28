import prisma from "@prisma/client";

const db =
  globalThis.prisma ||
  new prismaClient({
    log: ["query", "log", "warn", "error"],
  });

if (process.env.NODE_ENV == "development") {
  globalThis.prisma = db;
}

export default db;
