//connect DRIZZLE ORM TO the DB

const {drizzle} = require('drizzle-orm/node-postgres')
require("dotenv/config")

const db = drizzle(process.env.DATABASE_URL)

module.exports = db;