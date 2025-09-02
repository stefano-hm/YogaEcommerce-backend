# YogaEcommerce Backend

A lightweight backend service for the **YogaEcommerce dApp**, responsible for storing and retrieving course purchases linked to Ethereum wallets. Built with **Node.js**, **Express**, and **SQLite**.

## 🚀 Features

- REST API to store purchased products by wallet address.
- Retrieve purchased products for a given wallet.
- Lightweight **SQLite database** (```purchases.db```) for persistence.
- Simple setup, minimal dependencies.
- CORS enabled to allow frontend integration.

## 🛠 Tech Stack

- Node.js
- Express
- SQLite
- cors

## 📂 Project Structure

  ```bash
yogaecommerce-backend/
├── package.json     # Project metadata and dependencies
├── server.js        # Main backend server with API routes
├── purchases.db     # SQLite database file (auto-created if missing)

  ```

## ⚙️ Installation

Clone the repository and install dependencies:

  ```bash
git clone <repo-url>
cd yogaecommerce-backend
npm install
  ```

## ▶️ Usage

Start the server:

  ```bash
npm start
  ```
By default, the backend runs on http://localhost:4000

You can change the port by setting the PORT environment variable.

## 📡 API Endpoints

**POST /purchases**
Store a new purchase linked to a wallet.

- **Request body (JSON):**
  
```bash
{
  "walletAddress": "0x123abc...",
  "productId": "yoga-course-1"
}
```

- **Response:**

```bash
{
  "success": true
}
```

- **Example with curl:**

```bash
curl -X POST http://localhost:4000/purchases \
     -H "Content-Type: application/json" \
     -d '{"walletAddress":"0x123abc...", "productId":"yoga-course-1"}'
```

**GET /purchases/:wallet**

Retrieve all purchased product IDs for a given wallet.

- **Request:**

```bash
GET http://localhost:4000/purchases/0x123abc...
```

- **Response:**

```bash
["yoga-course-1", "yoga-course-2"]
```

## 💾 Database

- The database is stored in ```purchases.db``` at the project root.
- Automatically initialized on first run.
- Tables:

 - *purchases*

       - ```id``` (INTEGER, auto-increment, primary key)
       - ```walletAddress``` (TEXT, lowercase enforced)
       - ```productId (TEXT)```

## 🔧 Development Notes

- Wallet addresses are normalized to lowercase before storage.
- The API currently only tracks ```walletAddress``` and ```productId```.
- Can be extended with timestamps, course metadata, or user profiles if needed.

## 📜 License

This project is licensed under the **MIT License**.
