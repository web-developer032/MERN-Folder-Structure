import dotenv from "dotenv";

import { createRequire } from "module";

import app from "./app.js";
import { initializeDatabase } from "./db.js";
import asyncHandler from "./utils/asyncHandler.js"; // module to use environment file
dotenv.config();

const require = createRequire(import.meta.url);

// IT SHOULD BE ON TOP SO THAT WE CATCH EVERY ERROR
// SOLVING UNCAUGHT EXCEPTION (for example a variable that is undefined)
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION. Shutting Down! 🤦‍♂️");
  console.log(err.name, err.message);
  console.log(err);
  // 0 for success
  // 1 for uncaught exception
  process.exit(1);
});

const initializeServer = asyncHandler(async () => {
  const dbConnection = await initializeDatabase();
  console.log("DB CONNECTION SUCCESSFULL");
  // console.log('DB CONNECTION: ', dbConnection);

  const port = process.env.PORT || 8000;

  const server = app.listen(port, () => {
    console.log("Listening at port: ", port);
  });

  // SOLVING UNHANDLED REJECTION (catch promise rejections etc)
  process.on("unhandledRejection", (err) => {
    console.log("🤷‍♂️ UNHANDLED REJECTION. Shutting Down! 🤦‍♂️");
    console.log(err.name, err.message);
    console.log(err);
    server.close(() => {
      // 0 for success
      // 1 for uncaught exception
      process.exit(1);
    });
  });

  process.on("SIGTERM", () => {
    console.log("👌 SIGTERM RECIEVED. Shutting Down! 🤦‍♂️");
    server.close(() => {
      console.log("💥🔥 Process terminated.");
    });
  });
});

initializeServer();
