import express from "express";
import { eq } from "drizzle-orm";
import db from "../db/index.js";
import { usersTable, userSessions } from "../db/schema.js";
import { randomBytes, createHmac } from "node:crypto";

const router = express.Router();

//returns current logged user
router.patch('/',async (req,res)=>{
  //update smtg you need who is logged in currently s code repeat --> use middleware
  // const {name}=req.body;

  const user = req.body;
  if (!user) {
    return res.status(401).json({ error: "You are not logged in" });
  }
  const {name}=req.body;
  if(!name){
    return res.status(400).json({ error: "Name is required" });
  }
  await db.update(usersTable).set({name}).where(eq(usersTable.id,user.id));
  return res.json({status:'success'})

})

router.get("/", async (req, res) => {
  // const sessionId = req.headers["session-id"];
  // if (!sessionId) {
  //   return res.status(401).json({ error: "You are not logged in" });
  // }
  // const [data] = await db
  //   .select({
  //     id: userSessions.id,
  //     userId: userSessions.userId,
  //     name: usersTable.name,
  //     email: usersTable.email,
  //   })
  //   .from(userSessions)
  //   .rightJoin(usersTable, eq(usersTable.id, userSessions.userId))
  //   .where((table) => eq(table.id, sessionId));

  // if (!data) {
  //   return res.status(401).json({ error: "You are not logged in" });
  // }
  const user = req.user;
  if (!user) {
    return res.status(401).json({ error: "You are not logged in" });
  }
  return res.json(user)
});

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  const [userexist] = await db
    .select({ email: usersTable.email })
    .from(usersTable)
    .where((table) => eq(table.email, email));

  if (userexist) {
    return res
      .status(400)
      .json({ error: `user with email ${email} already exists` });
  }
  const salt = randomBytes(256).toString("hex");
  const hashPassword = createHmac("sha256", salt)
    .update(password)
    .digest("hex");

  const [user] = await db
    .insert(usersTable)
    .values({
      name,
      email,
      password: hashPassword,
      salt,
    })
    .returning({ id: usersTable.id });

  return res.status(201).json({ status: "success", data: { userId: user.id } });
});
// email password received ,(but in db pass = hashed) check email exists or not in db , if it does take the salt from user then hash that salt again  compare this with stored hashed password
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const [userexist] = await db
    .select({
      id: usersTable.id,
      email: usersTable.email,
      salt: usersTable.salt,
      password: usersTable.password,
    })
    .from(usersTable)
    .where((table) => eq(table.email, email));

  if (!userexist) {
    return res.status(404).json({ error: `user with email does not exists` });
  }
  const salt = userexist.salt; //existing salt from db
  const existingHash = userexist.password; //present hashed in db

  const newHash = createHmac("sha256", salt).update(password).digest("hex"); //this password is from body
  // body req pass + db salt = new hash

  if (newHash != existingHash) {
    return res.status(400).json({ error: "Incorrect password" });
  }

  //generate a session for user anss store  -  pass matched
  const [session] = await db
    .insert(userSessions)
    .values({
      userId: userexist.id,
    })
    .returning({ id: userSessions.id });

  return res.json({ status: "success", sessionId: session.id });
});

export default router;
