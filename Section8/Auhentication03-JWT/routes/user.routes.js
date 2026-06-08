import express from "express";
import { eq } from "drizzle-orm";
import db from "../db/index.js";
import { usersTable, userSessions } from "../db/schema.js";
import { randomBytes, createHmac } from "node:crypto";
import jwt from 'jsonwebtoken';
import {ensureAuthenticated} from "../middlewares/auth.middeware.js"

const router = express.Router();

//returns current logged user
router.patch('/',ensureAuthenticated,async (req,res)=>{
  //update smtg you need who is logged in currently s code repeat --> use middleware
  // const {name}=req.body;

  // const user = req.body;
  // if (!user) {
  //   return res.status(401).json({ error: "You are not logged in" });
  // } isko middleware banadia route k baju me dek 
  const {name}=req.body;
  if(!name){
    return res.status(400).json({ error: "Name is required" });
  }
  await db.update(usersTable).set({name}).where(eq(usersTable.id,user.id));
  return res.json({status:'success'})

})

router.get("/", ensureAuthenticated,async (req, res) => {

  return res.json(req.user)
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
    // find user by email
  const [userexist] = await db
    .select({
      id: usersTable.id,
      email: usersTable.email,
      salt: usersTable.salt,
      password: usersTable.password,
      role: usersTable.role,
      name: usersTable.name
      
    })
    .from(usersTable)
    .where((table) => eq(table.email, email));

  if (!userexist) {
    return res.status(404).json({ error: `user with email does not exists` });
  }
  // verify password
  const salt = userexist.salt; //existing salt from db
  const existingHash = userexist.password; //present hashed in db

  const newHash = createHmac("sha256", salt).update(password).digest("hex"); //this password is from body
  // body req pass + db salt = new hash

  if (newHash != existingHash) {
    return res.status(400).json({ error: "Incorrect password" });
  }

  const payload = {
    id : userexist.id,
    email:userexist.email,
    name:userexist.name,
    role:userexist.role
  }
  const token = jwt.sign(payload , process.env.JWT_SECRET);
  return res.json({ status: "success", token : token });
});

export default router;
