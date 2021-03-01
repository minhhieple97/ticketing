import express from "express";
import jwt from "jsonwebtoken";
import { currentUser } from "@lmhticket/common";

const router = express.Router();

router.get("/api/users/currentuser", currentUser, (req, res) => {
  try {
    res.send({ currentUser: req.currentUser || null });
  } catch (error) {
    res.send({ currentUser: null });
  }
});

export { router as currentUserRouter };
