import mongoose from "mongoose";

export async function initializeDatabase() {
  //   let dbURL = process.env.DATABASE_ONLINE;
  const dbURL = process.env.DATABASE_OFFLINE;

  return mongoose.connect(dbURL);
}
