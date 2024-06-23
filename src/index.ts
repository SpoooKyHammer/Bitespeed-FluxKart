import { Express } from "express";
const express = require("express");

import { identifyRouter } from "./routes/identify";
import { contactAllRouter } from "./routes/contact-all";

const app: Express = express();

app.use(express.json());
app.use("/api/v1/", identifyRouter);
app.use("/api/v1/", contactAllRouter);

app.listen(3000, () => {
  console.log("[SERVER] Listening...");
})
