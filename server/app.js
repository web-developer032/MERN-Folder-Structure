import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import xss from "xss-clean";

import routes from "./routes.js";
import { __dirname } from "./utils/common.js";

const app = express();
// IMPLEMENTING CORS SO THAT OTHER WEBSITES CAN USE OUR API
app.use(cors()); // THIS WILL WORK FOR SIMPLE REQUESTS LIKE (GET AND POST) BUT NOT FOR (PATCH, DELETE or PUT). or for cookies

// FOR NON-SIMPLE REQUEST WE USE app.options request.
app.options("*", cors()); // app.options() is just like app.get or post etc.

app.enable("trust proxy");

// GLOBAL MIDDLEWARE: SECURITY HTTP HEADER
// USE HELMET IN THE START OF MIDDLEWARES i.e AS A FIRST MIDDLEWARE
app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);
// eslint-disable-next-line n/no-path-concat
app.use(express.static(`${__dirname}/public`)); // to access files from the server. (STATIC FILES)

if (process.env.NODE_ENV === "DEVELOPMENT") {
  app.use(morgan("dev"));
}

// GLOBAL MIDDLEWARE: LIMIT REQUEST
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message:
    "Too many requests detected from your IP! Please try again after one hour.",
});

app.use(cookieParser()); // TO READ COOKIES SENT FROM CLIENT

// BODYPARSER, READING DATA FROM FRONTEND AND PUTTING IT INTO req.body
app.use(express.json({ limit: "10kb" })); // to use data that is sent by user from front-end. limit the data to 10kb that user can sent.
app.use(express.urlencoded({ extended: true, limit: "10kb" })); // TO USE DATA COMING FROM FRONTEND BY SUBMITTING FORM

// DATA SANITIZATION (CLEARNING) AGAINST NOSQL QUERY
app.use(mongoSanitize()); // IT PREVENT ATTACKS LIKE: { email: {$gt: ""}, password: pass1228}

// DATA SANITIZATION (CLEARNING) AGAINST XSS (CROSS SITE SCRIPTING ATTACK)
app.use(xss());

// USE THIS MIDDLEWARE TO COMPRESS TEXT RESPONSE THAT WE SENT TO CLIENTS
app.use(compression());

app.use("/api/", limiter);

app.get("/ping", (req, res) => {
  res.send("PONG");
});

routes.forEach((route) => {
  app.use(`/api/${route.path}`, route.router);
});

export default app;
