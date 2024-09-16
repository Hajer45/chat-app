import express from 'express';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes.js'
import messageRoutes from './routes/message.routes.js'
import connectDB from './db/connect.js';
const app = express()
const PORT = process.env.PORT || 3000

dotenv.config();

app.use(express.json()) // to accept json data

app.use("/api/auth",authRoutes)
app.use("/api/messages",messageRoutes)


app.listen(PORT, () => {
    connectDB()
    console.log(`Listening on port ${PORT}`)
})






