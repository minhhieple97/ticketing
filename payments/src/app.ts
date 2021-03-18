import { errorHandler, NotFoundError, currentUser } from "@lmhticket/common";
import express from "express";
import cookieSession from "cookie-session";
import { createChargeRouter } from "./routes/new";
const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);
app.use(createChargeRouter)
app.all("*", () => {
  throw new NotFoundError();
});
app.use(errorHandler);
export default app;
