import dotenv from "dotenv";

import app from "./app";
import { initializeDatabase } from "./db";
import asyncHandler from "./utils/asyncHandler"; // module to use environment file

dotenv.config();

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
  // eslint-disable-next-line no-unused-vars
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
