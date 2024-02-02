import mongoose from 'mongoose';

export async function initializeDatabase() {
  //   let dbURL = process.env.DATABASE_ONLINE;
  let dbURL = process.env.DATABASE_OFFLINE;

  return await mongoose.connect(dbURL);
}
