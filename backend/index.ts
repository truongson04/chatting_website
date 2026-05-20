import { Express, Request, Response } from "express";
import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";

import routes from "./src/routes/index.js";
import { connectDb } from "./src/lib/db.js";
const app: Express = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(cookieParser());

await connectDb();
routes(app);
const port = process.env.PORT;

app.listen(port, () => {
  console.log(` The server is running at http://localhost:${port}`);
});
