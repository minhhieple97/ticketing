import { errorHandler, NotFoundError, currentUser } from "@lmhticket/common";
import express from "express";
import { createTicketRouter } from "../src/routes/new";
import cookieSession from "cookie-session";
const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);
app.use(currentUser);
app.use(createTicketRouter);
app.all("*", () => {
  throw new NotFoundError();
});
app.use(errorHandler);
export default app;
