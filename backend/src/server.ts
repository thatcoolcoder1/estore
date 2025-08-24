import express from "express";
import type { Request, Response } from "express"
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes.js"
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import analyticsRoutes from "./routes/analyticsRoutes.js"
import errorHandler from "./middleware/errorHandler.js"
import paymentRoutes from "./routes/paymentRoutes.js";
import cors from "cors"

const app = express();
const port = 3000;


app.use(
  cors({
    origin: "http://localhost:5173", // your frontend URL
    credentials: true,               // if you use cookies/sessions later
  })
);// Middleware to parse JSON bodies
app.use(express.json());

// Mount routes
app.use("/auth", authRoutes);
console.log("authroutes mounted")
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes)
app.use('/api/order', orderRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/admin/analytics', analyticsRoutes)
app.use('/api/payments', paymentRoutes)
app.use(errorHandler)
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

export default app;
