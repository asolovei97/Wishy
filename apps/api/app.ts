import express from "express";

import cors from "cors";
import morgan from "morgan";
import { rateLimit } from "express-rate-limit";
import { xss } from "express-xss-sanitizer";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import {
  prisma,
  adminRouter,
  clientRouter,
  AppError,
  HandleError,
} from "./src";

const app = express();

// Set security THHP header
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(cors());
app.use(cookieParser());
app.use(express.json());

// Limit requests from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});

app.use("/api", limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));

// Data sanitization against XSS
app.use(xss());

// Serving static files
// app.use(express.static(`${__dirname}/public`));

// Main Routes
app.use("/api/v1", adminRouter);
app.use("/api/v1", clientRouter);

app.get("/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", database: "connected" });
  } catch (error) {
    console.error("Database connection failed:", error);
    res.status(500).json({ status: "error", database: "disconnected" });
  }
});

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Error handling - MUST be after routes
app.use(HandleError.handle);

export default app;
