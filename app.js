import express, { json } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import cors from "cors";
import hpp from "hpp";
import bodyParser from "body-parser";
import xss from "xss-clean";

// Error file
import AppError from "./utils/appError.js";
// const AppError = require("./utils/appError");
import globalErrHandler from "./controllers/errorController.js";
// Express using

//Routes
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRouter from "./routes/categoryRouter.js";
import appointmentRouter from "./routes/appointmentRouter.js";
import offersRouter from "./routes/offersRoutes.js";
import themeRouter from "./routes/themeRouter.js";
import adminRouter from "./routes/adminRouter.js";

import admin from "firebase-admin";
import serviceAccount from "./utils/firebase.js";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();

// app.set('trust proxy', true);

// Allow Cross-Origin requests
app.use(cors());

// Set security HTTP headers
app.use(helmet());

// Limit request from the same API
const limiter = rateLimit({
  max: 150000,
  windowMs: 60 * 60 * 1000,
  message: "Too Many Request from this IP, please try again in an hour",
});
app.use("/api", limiter);

// Body parser, reading data from body into req.body
app.use(bodyParser.json({ limit: '50mb' }));

app.use(
  express.json({
    limit: "15kb",
  })
);

// Data sanitization against Nosql query injection
app.use(mongoSanitize());

// Data sanitization against XSS(clean user input from malicious HTML code)
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/appointment", appointmentRouter);
app.use("/api/v1/offers", offersRouter);
app.use("/api/v1/theme", themeRouter);
app.use("/api/v1/admin", adminRouter);

// handle undefined Routes
app.use("*", (req, res, next) => {
  const err = new AppError(404, "fail", "undefined route");
  next(err, req, res, next);
});

// Error-handling middleware
app.use((err, req, res, next) => {
  // Log the error or handle it in some way
  console.error(err);

  // Respond with an error message
  res.status(err.statusCode || 500).json({
    status: err.status || "error",
    message: err.message || "Internal Server Error",
  });
});

app.use(globalErrHandler);

export default app;
