import "dotenv/config";
import express from "express";
import router from "./src/route";
import cors from "cors";

import cookieParser from "cookie-parser";

import { AppDataSource } from "./src/data-source";
import errorMiddleware from "./src/middleware/error.middleware";
const app = express();
const port = process.env.PORT || 8080;

AppDataSource.initialize();

app.set("trust proxy", true);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

app.use(router);
app.use(errorMiddleware);
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
