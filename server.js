import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

let db;

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
  await db.exec(`
    CREATE INDEX IF NOT EXISTS idx_wallet ON purchases(walletAddress);
  `);
}
initDb();

app.post("/purchases", async (req, res) => {
  try {
    let { walletAddress, productId } = req.body;
    if (!walletAddress || !productId) {
      return res.status(400).json({ error: "Missing fields" });
    }

    walletAddress = walletAddress.toLowerCase();

    await db.run(
      "INSERT INTO purchases (walletAddress, productId) VALUES (?, ?)",
      [walletAddress, productId]
    );

    console.log(`[POST] Purchase saved: ${walletAddress} -> ${productId}`);
    res.json({ success: true });
  } catch (err) {
    console.error("Errore POST /purchases:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/purchases/:wallet", async (req, res) => {
  try {
    const wallet = req.params.wallet.toLowerCase();
    const rows = await db.all(
      "SELECT productId FROM purchases WHERE walletAddress = ?",
      [wallet]
    );
    console.log(`[GET] Purchases for ${wallet}: ${rows.map(r => r.productId)}`);
    res.json(rows.map((r) => r.productId));
  } catch (err) {
    console.error("Errore GET /purchases:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`Backend running on port ${PORT}`)
);
