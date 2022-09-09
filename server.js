import express from 'express';
import dotenv from 'dotenv';
import bootcampsRoutes from './routes/bootcampsRoutes.js';
import morgan from 'morgan';
import connectDB from './config/db.js';
import errorHandler from './middleware/error.js';

dotenv.config({ path: './config/config.env' });
connectDB();

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.get('/', (req, res) => res.send(`API is running on ${PORT}`));
app.use('/api/v1/bootcamps', bootcampsRoutes);

app.use(errorHandler);

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
