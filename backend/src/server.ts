import express from "express";
import type { Request, Response} from "express"
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js"
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Mount routes
app.use("/auth", authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart',cartRoutes)
app.use('/api/order',orderRoutes)
app.use('/api/admin',adminRoutes)
// Root test route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello world!");
});

// Connect to DB and start server
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server after database connection failure.");
    process.exit(1);
  });
