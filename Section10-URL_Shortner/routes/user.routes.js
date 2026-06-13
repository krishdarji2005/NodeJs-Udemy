import express from "express";
import { usersTable } from "../models/index.js";
import db from "../db/index.js";

import { getUserByEmail, createUser } from "../services/user.services.js";

import {
  signupPostRequestBodySchema,
  loginPostRequestBodySchema,
} from "../validation/req.validation.js";
import { hashPasswordWithSalt } from "../utils/hash.js";
import jwt from "jsonwebtoken";
import {createUserToken} from '../utils/token.js'


const router = express.Router();

router.post("/signup", async (req, res) => {
  // const { firstname, lastname, email, password } = req.body;
  const validationResult = await signupPostRequestBodySchema.safeParseAsync(
    req.body
  );
   if (validationResult.error) {
    return res.status(400).json({ error: validationResult.error });
  }

  const { firstname, lastname, email, password } = validationResult.data;

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return res
      .status(400)
      .json({ error: `user with email ${email} already exists` });
  }
  //                      V rename
  const { salt, password: hashedPassword } = hashPasswordWithSalt(password);

  const user = await createUser(
    firstname,
    lastname,
    email,
    hashedPassword,
    salt
  );

  res.json({ status: "success", data: { userId: user.id } });
});

router.post("/login", async (req, res) => {

  const validationResult = await loginPostRequestBodySchema.safeParseAsync(
    req.body
  );

  if (validationResult.error) {
    return res.status(400).json({ error: validationResult.error });
  }
  const { email, password } = validationResult.data;

  const user = await getUserByEmail(email);

  if (!user) {
    return res
      .status(400)
      .json({ error: `user with email ${email} does not exists` });
  }

  const { password: hashedPassword } = hashPasswordWithSalt(
    password,
    user.salt
  );

  if (user.password !== hashedPassword) {
    return res.status(400).json({ error: `Invalid Password` });
  }

  // const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
  const token = await createUserToken({id: user.id })
  return res.json({
    status: "success",
    token,
  });
});

export default router;
