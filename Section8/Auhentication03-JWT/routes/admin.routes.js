import express from "express";
import db from "../db/index.js"
import { usersTable } from "../db/schema.js";
import {ensureAuthenticated,restrictToROle} from "../middlewares/auth.middeware.js"

const adminRestrictMiddleware = restrictToROle('ADMIN')

const router = express.Router();



//restricted to admin only                     🔽
router.get("/users",ensureAuthenticated, adminRestrictMiddleware,async function (req, res) {


  const users = await db.select({
    id:usersTable.id,
    name:usersTable.name,
    email:usersTable.email,
  }).from(usersTable);

  return res.json(users)
});

export default router;
