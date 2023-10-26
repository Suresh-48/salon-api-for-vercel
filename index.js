import express, { json } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";
import cors from "cors";
import globalErrHandler from "./controllers/errorController.js";
import AppError from "./utils/appError.js";

// Database Configuration 
import mongoose from "mongoose";
const { connect } = mongoose;
import { config } from "dotenv";

const app = express();
config({
  path: "./.env",
});

process.on("uncaughtException", (err) => {
	console.log("UNCAUGHT EXCEPTION!!! shutting down...");
	console.log(err.name, err.message);
	process.exit(1);
  });

  mongoose.set('strictQuery', true);

const database = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);

// Connect to the database
connect(database, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then((con) => {
  console.log("Database Connected Successfully");
});

// Start Server
const port = process.env.PORT || 3004;
app.listen(port, () => {
  console.log(`Application is running on port ${port}`);
});

//Close Server
process.on("unhandledRejection", (err) => {
	console.log("UNHANDLED REJECTION!!! shutting down ...");
	console.log(err.name, err.message);
  });





// Import Routes
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRouter from './routes/categoryRouter.js';
import appointmentRouter from './routes/appointmentRouter.js';
import offersRouter from './routes/offersRoutes.js';
import admin from 'firebase-admin';
import serviceAccount from './utils/firebase.js';


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});


//Allow cross-orgin request
app.use(cors());

//Set secure HTTP header
app.use(helmet());

//Limit request from same API
const limiter = rateLimit({
  max: 150000,
  windowMs: 60 * 60 * 1000,
  message: "Too Many Request from this API, please try again later",
});
app.use("/api", limiter);
//Body parser, reading data from request
app.use(
  json({
    limit: "25MB",
  })
);
// Data sanitization against sql query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

//Prevent parameter pollution
app.use(hpp());


// Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/product', productRoutes);
app.use('/api/v1/category', categoryRouter);
app.use('/api/v1/appointment', appointmentRouter);
app.use('/api/v1/offers', offersRouter);


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
    status: err.status || 'error',
    message: err.message || 'Internal Server Error',
  });
});

app.use(globalErrHandler);

export default app;
