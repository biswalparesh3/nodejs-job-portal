import express from "express";
import 'express-async-errors'
import dotenv from 'dotenv';
import colors from 'colors';
import cors from 'cors';
import morgan from "morgan";

// Security Packages
import helmet from "helmet";
import xss from 'xss-clean'
import mongoSanitize from 'express-mongo-sanitize'

import connectdb from "./config/db.js";
import testRoute from "./routes/testroute.js";
import authroutes from "./routes/authroutes.js";
import userroutes from "./routes/userroute.js";
import jobsroutes from "./routes/jobsroute.js"
import errorMiddleware from "./middlewares/errorMiddleware.js";
dotenv.config();
connectdb();
const app = express();
app.use(helmet())
app.use(xss())
app.use(mongoSanitize())
app.use(express.json())
app.use(cors())
app.use(morgan('dev'))

app.use('/api/v1/test', testRoute)
app.use('/api/v1/auth', authroutes)
app.use('/api/v1/user', userroutes)
app.use('/api/v1/job', jobsroutes)
// Validation middleware

app.use(errorMiddleware)

// port
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.DEV_MODE} mode on PORT ${PORT}`.blue)
}) 