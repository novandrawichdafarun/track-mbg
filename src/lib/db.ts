import mongoose from "mongoose";

let MONGODB_URL;

if (process.env.NODE_ENV === "production") {
  MONGODB_URL = `${process.env.MONGODB_URL}/track-mbg`;
} else {
  MONGODB_URL = `${process.env.MONGODB_URL}/TEST`;
}

if (MONGODB_URL === null)
  throw new Error("variable MONGODB_URL di dalam file .env tidak ada");

//? Interface untuk menampung cache koneksi di global scope
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

//? Menambahkan properti mongoose ke object global NodeJS untuk caching
declare global {
  var mongoose: MongooseCache;
}

let cached = global.mongoose;

if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, //! Opsi optimasi
    };

    cached.promise = mongoose.connect(MONGODB_URL!, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectDB;
