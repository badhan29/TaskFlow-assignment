import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use("/", (req, res) => {
//     res.send("Welcome to TaskFlow API");
//     next();
// });

app.use("/api/auth", authRoutes);


export default app;