import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

// async function as db will be in some other continent
export async function dbConnect(): Promise<void> {
  /// if DB is already connected avoid making redundent connnections to DB which will choke up the connections
  if (connection.isConnected) {
    console.log("Database already connected");
    return;
  }

  try {
    // try to make the DB connection
    const db = await mongoose.connect(process.env.MONGO_DB_URL || "");
    console.log(db.connections[0].readyState);

    connection.isConnected = db.connections[0].readyState;

    console.log("Database connected");
  } catch (error) {
    console.log(error);
    console.log("Error connecting to database");
    process.exit(1);
  }
}
