import express from 'express';
import dotenv from 'dotenv';
import connectDb from "./database/db.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

dotenv.config();
const PORT = process.env.PORT || 8000;

// middlewares
app.use(express.json());

// mount routes
app.use("/api/user", userRoutes);

// connect with mongodb
connectDb();

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
})
