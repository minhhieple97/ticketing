import mongoose from "mongoose";
import app from "./app";
const start = async () => {
  try {
    if (!process.env.MONGO_URI || !process.env.JWT_KEY) {
      throw new Error("Missing environment variable,");
    }
    await mongoose.connect(process.env.MONGO_URI!, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.error(error);
  }
  app.listen(3000, () => {
    console.log("Listening on port 3000.");
  });
};
start();
