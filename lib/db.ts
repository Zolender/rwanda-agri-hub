// Look at your file path in the sidebar. 
// If db.ts is in /lib, and the client is in /app/generated/prisma, this path is correct:
import { PrismaClient } from '../app/generated/prisma/client';

const prismaClientSingleton = () => {
  // We pass an empty object {} to satisfy the "1 argument" requirement
  return new PrismaClient({});
};

declare global {
  var prismaGlobal: ReturnType<typeof prismaClientSingleton> | undefined;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;