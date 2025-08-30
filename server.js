import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

let db;

// Init database
async function initDb() {
  db = await open({
    filename: "./purchases.db",
    driver: sqlite3.Database,
  });
  await db.exec(`
    CREATE TABLE IF NOT EXISTS purchases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      walletAddress TEXT NOT NULL,
      productId TEXT NOT NULL
    )
  `);
}
initDb();

// POST /purchases
app.post("/purchases", async (req, res) => {
  const { walletAddress, productId } = req.body;
  if (!walletAddress || !productId) return res.status(400).json({ error: "Missing fields" });
  await db.run("INSERT INTO purchases (walletAddress, productId) VALUES (?, ?)", [walletAddress, productId]);
  res.json({ success: true });
});

// GET /purchases/:wallet
app.get("/purchases/:wallet", async (req, res) => {
  const { wallet } = req.params;
  const rows = await db.all("SELECT productId FROM purchases WHERE walletAddress = ?", [wallet]);
  res.json(rows.map(r => r.productId));
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
