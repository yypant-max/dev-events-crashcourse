import mongoose, { Connection } from 'mongoose';

/**
 * Global cache for the Mongoose connection to prevent multiple connections
 * during development hot reloads in Next.js.
 */
declare global {
  var mongoose: {
    conn: Connection | null;
    promise: Promise<Connection> | null;
  };
}

/**
 * Connects to the MongoDB database using Mongoose.
 * Caches the connection to avoid reconnecting on every request in development.
 * @returns A promise that resolves to the Mongoose connection.
 */
async function connectToDatabase(): Promise<Connection> {
  // Check if we have a cached connection
  if (global.mongoose?.conn) {
    return global.mongoose.conn;
  }

  // If no cached connection, check if a connection promise is in progress
  if (!global.mongoose?.promise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('Please define the MONGODB_URI environment variable');
    }

    // Create a new connection promise with optimized options
    global.mongoose = {
      conn: null,
      promise: mongoose.connect(uri, {
        // Buffer commands to prevent Mongoose from buffering commands when not connected
        bufferCommands: false,
      }).then((mongooseInstance) => {
        console.log('Connected to MongoDB');
        return mongooseInstance.connection;
      }),
    };
  }

  // Wait for the connection promise to resolve
  global.mongoose.conn = await global.mongoose.promise;
  return global.mongoose.conn!;
}

export default connectToDatabase;