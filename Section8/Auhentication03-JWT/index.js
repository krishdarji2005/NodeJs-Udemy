import express from "express";
const app = express();
import userRouter from "./routes/user.routes.js";
import adminRouter from "./routes/admin.routes.js"
import {authenticationMiddleware}from "./middlewares/auth.middeware.js"

import jwt from 'jsonwebtoken';


const PORT = process.env.PORT ?? 8000;

app.use(express.json());

app.get("/", (req, res) => {
  return res.json({ status: "server is up and running" });
});

app.use(authenticationMiddleware);
app.use("/user", userRouter);
app.use("/admin", adminRouter);

app.listen(PORT, () => {
  console.log("App is running on Port =", PORT);
});
