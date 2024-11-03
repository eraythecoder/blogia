import mongoose from "mongoose";
import connectMongo from "connect-mongodb-session";
import session from "express-session";
import dotenv from "dotenv";
dotenv.config();

const MongoDBStore = connectMongo(session);

const mongoURI = process.env.MONGO_URI;

const store = new MongoDBStore({
  uri: mongoURI,
  collection: "sessions",
});

store.on("error", (error) => {
  console.error("Session store error:", error);
});

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("Db bağlantısı sağlandı");
  } catch (error) {
    console.error("MongoDB hatası:", error);
    process.exit(1);
  }
};

export { connectDB, store };
