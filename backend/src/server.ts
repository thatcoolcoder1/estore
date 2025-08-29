import express from "express";
import type { Request, Response } from "express";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import cors from "cors";

const app = express();
// Use the port provided by the environment (for Render) or 3000 for local dev
const port = process.env.PORT || 3000;


const allowedOrigins = [
  'https://estore-rho.vercel.app',                              // Your main production URL
  /^https:\/\/estore-.*-thatcoolcoder1s-projects\.vercel\.app$/, // RegExp for all Vercel previews
  'http://localhost:5173'                                     // Your local development URL
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Check if the origin matches any of the allowed origins (string or RegExp)
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === 'string') {
        return allowedOrigin === origin;
      }
      if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return false;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));

// --- END CORS CONFIGURATION ---
app.use(express.json());   // This should come after CORS

// Mount routes
app.use("/auth", authRoutes);
console.log("authroutes mounted");
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/analytics', analyticsRoutes);
app.use('/api/payments', paymentRoutes);
app.use(errorHandler);

// Root test route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello world!");
});

// Connect to DB and start server
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });

export default app;