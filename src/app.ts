import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import defiRoutes from "./routes/defiRoutes";
import quizRoutes from "./routes/quizRoutes";
import userHistoryRoutes from "./routes/userHistoryRoutes";

import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(bodyParser.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/defi", defiRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/userHistory", userHistoryRoutes);

const dbURI =
  process.env.NODE_ENV === "test"
    ? process.env.MONGODB_TEST_URI
    : process.env.MONGODB_URI;

mongoose
  .connect(dbURI as string)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
export { app, PORT };
