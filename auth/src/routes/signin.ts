import express, { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import User from "../models/user";
import { validatorRequest } from "../middlewares/validator-request";
import BadRequestError from "../errors/bad-request-error";
import Password from "../services/password";
import jwt from "jsonwebtoken";
const router = express.Router();
router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").trim().notEmpty().withMessage("You must suppy a password"),
  ],
  validatorRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        throw new BadRequestError("Invalid credentials");
      }
      const flagPassword = Password.compare(
        existingUser.password,
        password
      );
      if (!flagPassword) {
        throw new BadRequestError("Invalid credentials");
      }
      const userJwt = jwt.sign(
        {
          id: existingUser.id,
          email: existingUser.email,
        },
        process.env.JWT_KEY!
      );
      req.session = { jwt: userJwt };
      res.status(201).send(existingUser);
    } catch (error) {
      next(error)
    }
  }
);

export { router as signinRouter };
