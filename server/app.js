import cors from "cors";
import express from "express";
import helmet from "helmet";

import routes from "./routes.js";

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

app.get("/ping", (req, res) => {
  res.send("PONG");
});

routes.forEach((route) => {
  app.use(`/api/${route.path}`, route.router);
});

export default app;
