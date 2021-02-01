import { errorHandler } from "./middlewares/error-handler";
import express from "express";
import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import NotFoundError from "./errors/not-found-error";
import mongoose from "mongoose";
("./errors/");
import cookieSession from "cookie-session";
const app = express();
// app.set("trust proxy", true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
  })
);
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
app.all("*", () => {
  throw new NotFoundError();
});
app.use(errorHandler);
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
