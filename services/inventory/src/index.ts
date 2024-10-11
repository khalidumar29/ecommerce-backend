import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import {
  createInventory,
  getInventoryById,
  updateInventory,
} from "./controllers";
import getInventoryDetails from "./controllers/getInventoryDetails";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP" });
});

app.use((req, res, next) => {
  const allowedOrigins = ["http://localhost:8081", "http://127.0.0.1:8081"];
  const origin = req.headers.origin || "";
  if (allowedOrigins.indexOf(origin) > -1) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    next();
  } else {
    res.status(403).json({ message: "Forbidden" });
  }
});

//  Routes
app.get("/inventories/:id", getInventoryById);
app.get("/inventories/:id/details", getInventoryDetails);
app.put("/inventories/:id", updateInventory);
app.post("/inventories", createInventory);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});
// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

const port = process.env.PORT || 4002;
const service = process.env.SERVICE_NAME || "Inventory-Service";

app.listen(port, () => {
  console.log(`${service} service is running on port ${port}`);
});
