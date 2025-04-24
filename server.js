import express from 'express'
import dotenv from 'dotenv';
import cors from 'cors'
import connectDB from './dbConfig/db.js';
import userRoutes from './routes/userRoutes.js';
connectDB();
const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// import { Configuration, OpenAIApi } from 'openai';
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
})

app.get("/" , (res) => {
    console.log("Hello World", res);
})

app.use("/api/users", userRoutes);