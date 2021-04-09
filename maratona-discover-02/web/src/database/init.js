const Database = require('./config')

async function init() {
  const db = await Database()

  await db.exec(`CREATE TABLE profile (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    avatar TEXT,
    monthly_budget INT,
    days_per_week INT,
    hours_per_day INT,
    vacation_per_year INT,
    value_hour INT
  )`)

  await db.exec(`CREATE TABLE jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    daily_hours INT,
    total_hours INT,
    createdAt DATETIME
  )`)

  await db.exec(`INSERT INTO profile (
    name, avatar,
    monthly_budget, days_per_week, hours_per_day, vacation_per_year, value_hour
  )
  VALUES (
    "Daniel", "https://github.com/danielbom.png",
    3000, 5, 5, 4, 30
  )`)

  await db.exec(`INSERT INTO jobs (name, daily_hours, total_hours, createdAt)
  VALUES 
  ("Pizzaria Guloso", 2, 1, 1618008348587),
  ("OneTwo", 3, 47, 1618008348587)
  `)

  db.close()
}

init()
