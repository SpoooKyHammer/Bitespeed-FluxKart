"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const identify_1 = require("./routes/identify");
const app = express();
app.use(express.json());
app.use("/api/v1/", identify_1.identifyRouter);
app.listen(3000, () => {
    console.log("[SERVER] Listening...");
});
