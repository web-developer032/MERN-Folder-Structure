import express from "express";
import routes from "./routes.js";

const app = express();

app.get("/ping", (req, res) => {
  res.send("PONG");
});

routes.forEach((route) => {
  app.use(`/api/${route.path}`, route.router);
});

export default app;
