// src/server.ts
import express from "express";
import type { Request, Response } from "express";
import os from "os";
import CORS from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger-docs/swagger.json" with { type: "json" };
import pool from "./config/db.js"; 
import Router from "./Route/index.js";
dotenv.config();

const app = express();

/* -------------------- Middleware -------------------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(CORS());
/* -------------------- Swagger Documentation -------------------- */
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  swaggerOptions: {
    url: "/api/v1/swagger.json",
  },
  customCss: ".swagger-ui .topbar { display: none }",
  customSiteTitle: "PO Admin Dashboard API Docs",
}));

// Serve swagger JSON
app.get("/api/v1/swagger.json", (_req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerDocument);
});

/* -------------------- Routes -------------------- */

// Test route
app.get("/", (_req: Request, res: Response) => {
  res.json({
    msg: "Welcome to the API",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV ?? "development",
  });
});

// Health check endpoint
app.get("/health", async (_req: Request, res: Response) => {
  try {
    await pool.query("SELECT 1");

    res.status(200).json({
      status: "OK",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    const error = err as Error;

    res.status(503).json({
      status: "Service Unavailable",
      database: "disconnected",
      error: error.message,
    });
  }
});

// API Routes
app.use("/api/v1/po",Router);
/* -------------------- Utils -------------------- */

// Get local IP address
const getLocalIP = (): string => {
  const interfaces = os.networkInterfaces();

  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name] ?? []) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }
  return "localhost";
};

// Test DB connection
const testConnection = async (): Promise<void> => {
  await pool.query("SELECT 1");
};

/* -------------------- Server Start -------------------- */

const startServer = async (): Promise<void> => {
  const PORT = Number(process.env.PORT) || 5000;

  try {
    await testConnection();

    const LOCAL_IP = getLocalIP();

    app.listen(PORT, "0.0.0.0", () => {
      if (process.env.NODE_ENV === "production") {
        console.log(`🚀 Server running in production mode on port ${PORT}`);
      } else {
       console.log("🚀 Server running on:");
      console.log(`   ➜ Local:   http://localhost:${PORT}`);

      if (LOCAL_IP !== "localhost") {
        console.log(`   ➜ Network: http://${LOCAL_IP}:${PORT}`);
      }

      console.log(`📊 Database: ${process.env.DB_NAME}@${process.env.DB_HOST}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV ?? "development"}`);
      }
    });
  } catch (err) {
    const error = err as Error;
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

/* -------------------- Start Server Call -------------------- */
startServer();
