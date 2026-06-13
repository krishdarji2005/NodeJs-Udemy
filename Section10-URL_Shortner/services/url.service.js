import db from "../db/index.js";
import { urlsTable } from "../models/url.model.js";



export async function insertShortCodeTarget(finalCode, url, userId) {
  const [result] = await db
    .insert(urlsTable)
    .values({
      shortCode: finalCode,
      targetURL: url,
      userId ,
    })
    .returning({
      id: urlsTable.id,
      shortCode: urlsTable.shortCode,
      targetURL: urlsTable.targetURL,
    });

  return result;
}
