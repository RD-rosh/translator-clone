import mongoose from "mongoose";
import { Html } from "next/document";

const connectionString =
  "mongodb+srv://${process.env.MONOGO_DB_USERNAME}:${process.env.MONOGO_DB_PASSWORD}@translator-clone-db.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000";

if (!connectionString) {
  throw new Error(
    "Please define MONGO_DB_USERNAME and MONOGO_DB_PASSWORD variables inside .env.local"
  );
}

const connectDB = async () => {
  //check if connected to mongoDB
  if (mongoose.connection?.readyState >= 1) {
    console.log("---Already Connected to MongoDB---");
    return;
  }

  try {
    await mongoose.connect(connectionString);
    console.log("---Connected to MongoDB---");
  } catch (err) {
    console.error("Could not connect to MongoDB : ", err);
  }
};

export default connectDB;
