import express, { NextFunction } from "express";
import { ErrorService } from "../service";
export default function (
  err: any,
  req: express.Request,
  res: express.Response,
  next: NextFunction
) {
  console.log(err);
  if (err instanceof ErrorService) {
    return res
      .status(err.status)
      .json({ message: err.message, errors: err.errors });
  }

  return res.status(500).json({ message: "Непредвиденная ошибка" });
}
