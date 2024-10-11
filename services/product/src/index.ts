import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import { createProduct, getProductDetails, getProducts } from "./controllers";

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
app.get("/products/:id", getProductDetails);
app.get("/products", getProducts);
app.post("/products", createProduct);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});
// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

const port = process.env.PORT || 4001;
const service = process.env.SERVICE_NAME || "Inventory-Service";

app.listen(port, () => {
  console.log(`${service} service is running on port ${port}`);
});
