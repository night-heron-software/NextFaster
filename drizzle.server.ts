// File: drizzle.server.ts

import { neonConfig, Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { WebSocket } from "ws";
import * as schema from "./src/db/schema";

const connectionString =
  process.env.NODE_ENV === "production"
    ? process.env.POSTGRES_URL
    : process.env.LOCAL_POSTGRES_URL;

if (process.env.NODE_ENV === "production") {
  neonConfig.webSocketConstructor = WebSocket;
  neonConfig.poolQueryViaFetch = true;
} else {
  neonConfig.wsProxy = (host) => `${host}:54330/v1`;
  neonConfig.useSecureWebSocket = false;
  neonConfig.pipelineTLS = false;
  neonConfig.pipelineConnect = false;
}

const pool = new Pool({ connectionString });

export const db = drizzle(pool, { schema });
