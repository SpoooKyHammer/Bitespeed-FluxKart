import { Express } from "express";
const express = require("express");

import { identifyRouter } from "./routes/identify";

const app: Express = express();

app.use(express.json());
app.use("/api/v1/", identifyRouter);

app.listen(3000, () => {
  console.log("[SERVER] Listening...");
})
