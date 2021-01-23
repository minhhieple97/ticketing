import { errorHandler } from './middlewares/error-handler';
import express from "express";
import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import  NotFoundError from './errors/not-found-error';
 './errors/'
const app = express();
app.use(express.json());
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
app.use(errorHandler);
app.all('*',()=>{
  throw new NotFoundError();
})
app.listen(3000, () => {
  console.log("Listening on port 3000.");
});
