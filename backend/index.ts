import { Express, Request, Response } from "express";
import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";

import routes from "./src/routes/index.js";
import { connectDb } from "./src/lib/db.js";
const app: Express = express();
app.use(express.json());
app.use(cookieParser());
await connectDb();
routes(app);
const port = process.env.PORT;

app.listen(port, () => {
  console.log(` The server is running at http://localhost:${port}`);
});
