import mongoose from "mongoose";
import app from "./app";
const start = async () => {
  // try {
  //   await mongoose.connect("mongodb://auth-mongo-service:27017/auth", {
  //     useCreateIndex: true,
  //     useNewUrlParser: true,
  //     useUnifiedTopology: true,
  //   });
  // } catch (error) {
  //   console.error(error);
  // }
  app.listen(3000, () => {
    console.log("Listening on port 3000.");
  });
};
start();
