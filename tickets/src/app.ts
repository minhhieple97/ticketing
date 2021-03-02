import { errorHandler, NotFoundError, currentUser } from "@lmhticket/common";
import express from "express";
import { createTicketRouter } from "../src/routes/new";
import { showTicketRouter } from '../src/routes/show';
import { indexTicketRouter } from '../src/routes/index';
import { updateTicketRouter } from '../src/routes/update'
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
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);
app.all("*", () => {
  throw new NotFoundError();
});
app.use(errorHandler);
export default app;
