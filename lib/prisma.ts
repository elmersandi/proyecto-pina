// Archivo: lib/prisma.ts
import { PrismaClient } from "@prisma/client"; 
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

/**
 * Definimos la interfaz para el objeto global.
 * Usamos tipos específicos de las librerías instaladas.
 */
interface GlobalPrisma {
  prisma: PrismaClient | undefined;
  prismaPool: Pool | undefined;
}

const globalForPrisma = globalThis as unknown as GlobalPrisma;

// Instanciamos el Pool de conexiones
const pool =
  globalForPrisma.prismaPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
  });

type PrismaPgPoolArg = ConstructorParameters<typeof PrismaPg>[0];

/**
 * @prisma/adapter-pg trae su propio árbol de tipos para `pg`, que puede no
 * coincidir 1:1 con `@types/pg` del proyecto. Convertimos al tipo exacto que
 * declara el constructor del adaptador para mantener tipado estricto.
 */
const adapter = new PrismaPg(pool as unknown as PrismaPgPoolArg);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.prismaPool = pool;
}