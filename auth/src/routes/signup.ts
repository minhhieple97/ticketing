import express, { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import { BadRequestError, validatorRequest } from "@lmhticket/common";
import User from "../models/user";
import jwt from "jsonwebtoken";
const router = express.Router();
router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validatorRequest
  ,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new BadRequestError("Email already use.");
      }
      const user = User.build({ email, password });
      await user.save();
      const userJwt = jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        process.env.JWT_KEY!
      );
      req.session = { jwt: userJwt };
      res.status(201).send({});
    } catch (error) {
      next(error)
    }
  }
);

export { router as signupRouter };
