import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

declare global {
  var prisma: PrismaClient | undefined;
}

// create client with extension
const prismaClient = new PrismaClient().$extends(withAccelerate());

// use global for hot reload
export const prisma = (global.prisma || prismaClient) as PrismaClient;

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
