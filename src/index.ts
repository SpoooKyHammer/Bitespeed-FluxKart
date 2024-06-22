import { Express, Request, Response } from "express";
const express = require("express");

const app: Express = express();

app.get("/", (req: Request, res: Response) => {
  res.send({"hello" : "world"});
});

app.listen(3000, () => {
  console.log("listening");
})
