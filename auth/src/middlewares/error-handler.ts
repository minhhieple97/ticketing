import { NextFunction, Request, Response } from "express";
import CustomError from "../errors/custom-error";
import DatabaseConnectionError from "../errors/database-connection-error";
import RequestValidationError from "../errors/request-validation-error";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof CustomError) {
        return res.status(err.statusCode).json({ errors: err.serializeErrors() })
    }
    console.log("Something went wrong", err);
    res.status(400).json({ errors: [{ message: 'Something went wrong!' }] })
} 