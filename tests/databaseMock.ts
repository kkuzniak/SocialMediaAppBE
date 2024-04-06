import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const mongoMemory = MongoMemoryServer.create();

export const connect = async () => {
  const uri = await (await mongoMemory).getUri();

  await mongoose.connect(uri);
};
export const closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await (await mongoMemory).stop();
};
export const clearDatabase = async () => {
  const { collections } = mongoose.connection;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};
