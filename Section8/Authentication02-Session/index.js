import express from "express";
const app = express();
import userRouter from "./routes/user.routes.js";

import { eq } from "drizzle-orm";
import db from "./db/index.js";
import { usersTable, userSessions } from "./db/schema.js";
import { randomBytes, createHmac } from "node:crypto";


const PORT = process.env.PORT ?? 8000;

app.use(express.json());

app.get("/", (req, res) => {
  return res.json({ status: "server is up and running" });
});

app.use(async function(req,res,next){
  const sessionId = req.headers["session-id"];
  if (!sessionId) {
    return next();
  }
  //if there is session is query in db
  const [data] = await db
    .select({
      sessionid: userSessions.id,
      id:usersTable.id,
      userId: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
    })
    .from(userSessions)
    .rightJoin(usersTable, eq(usersTable.id, userSessions.userId))
     .where(eq(userSessions.id, sessionId)); 

    if(!data){
      return next();
    }
    req.user = data;
    next();

    // req came if user is looged in or not checked by middleware if it is logged user info will be added  in current  req 
})
app.use("/user", userRouter);
app.listen(PORT, () => {
  console.log("App is running on Port =", PORT);
});
