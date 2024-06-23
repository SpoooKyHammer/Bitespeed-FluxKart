"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const identify_1 = require("./routes/identify");
const contact_all_1 = require("./routes/contact-all");
const app = express();
app.use(express.json());
app.use("/api/v1/", identify_1.identifyRouter);
app.use("/api/v1/", contact_all_1.contactAllRouter);
app.listen(3000, () => {
    console.log("[SERVER] Listening...");
});
