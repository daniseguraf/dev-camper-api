import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import chalk from 'chalk';
import fileupload from 'express-fileupload';
import cookieParser from 'cookie-parser';

import connectDB from './config/db.js';
import bootcampsRoutes from './routes/bootcamps.js';
import coursesRoutes from './routes/courses.js';
import authRoutes from './routes/auth.js';
import errorHandler from './middleware/error.js';

dotenv.config({ path: './config/config.env' });
connectDB();

const PORT = process.env.PORT || 5000;

const app = express();

// Body parser
app.use(express.json());

// Cookie parser middleware
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// File uploading
app.use(fileupload());

app.get('/', (req, res) => res.send(`API is running on ${PORT} 🚀`));
app.use('/api/v1/bootcamps', bootcampsRoutes);
app.use('/api/v1/courses', coursesRoutes);
app.use('/api/v1/auth', authRoutes);

app.use(errorHandler);

app.listen(
  PORT,
  console.log(
    chalk.magenta(
      `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
    )
  )
);
