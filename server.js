import 'dotenv/config';
import express from "express";
import cors from "cors";
import { supabase } from "./supabaseClient.js"; 

const app = express();
app.use(
  cors({
    origin: [
      "https://yoga-ecommerce.vercel.app",
      "http://localhost:5173",
      "http://127.0.0.1:5173",
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

app.post("/purchases", async (req, res) => {
  try {
    let { walletAddress, productId } = req.body;
    if (!walletAddress || !productId) {
      return res.status(400).json({ error: "Missing fields" });
    }

    walletAddress = walletAddress.toLowerCase();

    const { data, error } = await supabase
      .from("purchases")
      .insert([{ wallet_address: walletAddress, product_id: productId }]);

    if (error) {
      console.error("[POST] Supabase error:", error);
      return res.status(500).json({ error: error.message });
    }

    console.log(`[POST] Purchase saved: ${walletAddress} -> ${productId}`);
    res.json({ success: true, data });
  } catch (err) {
    console.error("Errore POST /purchases:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/purchases/:wallet", async (req, res) => {
  try {
    const wallet = req.params.wallet.toLowerCase();

    const { data, error } = await supabase
      .from("purchases")
      .select("product_id")
      .eq("wallet_address", wallet);

    if (error) {
      console.error("[GET] Supabase error:", error);
      return res.status(500).json({ error: error.message });
    }

    console.log(`[GET] Purchases for ${wallet}: ${data.map(r => r.product_id)}`);
    res.json(data.map(r => r.product_id));
  } catch (err) {
    console.error("Errore GET /purchases:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
