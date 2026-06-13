// '/shorten' short the given route
import express from "express";
import { shortenPostRequestBodySchema } from "../validation/req.validation.js";
import { nanoid } from "nanoid";
import { urlsTable } from "../models/url.model.js";
import db from "../db/index.js";
import { ensureAuthenticated } from "../middlewares/auth.middleware.js";
import { insertShortCodeTarget } from "../services/url.service.js";
import { and, eq } from "drizzle-orm";
const router = express.Router();

//create a short url from long one
router.post("/shorten", ensureAuthenticated, async (req, res) => {
  const validationResult = await shortenPostRequestBodySchema.safeParseAsync(
    req.body
  );

  if (validationResult.error) {
    return res
      .status(400)
      .json({ error: "bad request : make sure the url is correct " });
  }
  const { url, shortCode } = validationResult.data;
  const finalCode = shortCode ?? nanoid(6);

  const result = await insertShortCodeTarget(finalCode, url, req.user.id);

  return res.status(201).json({ status: `success`, data: result });
});

router.get("/codes", ensureAuthenticated, async function (req, res) {
  const codes = await db
    .select()
    .from(urlsTable)
    .where(eq(urlsTable.userId, req.user.id));

  return res.json({ codes });
});

router.delete("/:id", ensureAuthenticated, async function (req, res) {
  const id = req.params.id;
  await db
    .delete(urlsTable)
    .where(and(eq(urlsTable.id, id), eq(urlsTable.userId, req.user.id)))


  return res.status(200).json({deleted:true});


});

// 'redirect to og url from short '
router.get("/:shortCode", async (req, res) => {
  const code = req.params.shortCode;

  const [result] = await db
    .select({ targetURL: urlsTable.targetURL })
    .from(urlsTable)
    .where(eq(urlsTable.shortCode, code));

  if (!result) {
    return res.status(404).json({ error: "Invalid Url" });
  }

  return res.redirect(result.targetURL);
});

export default router;
