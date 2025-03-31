import express from "express";
import mongoose from "mongoose";
import { usersRoutes } from "./routes/usersRoutes.js";
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/userScore", usersRoutes);
mongoose
  .connect(process.env.DB_URI, { dbName: "scores" })
  .then(() => {
    console.log("connected to DB successfully");
    app.listen(5000, "localhost", () => console.log("Listening to port 5000..."));
  })
  .catch((err) => console.log(err));
