import express from "express";
import type { Request, Response} from "express"
import connectDB from "./config/db.ts";
import authRoutes from "./routes/authRoutes.ts";

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Mount routes
app.use("/", authRoutes);

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
