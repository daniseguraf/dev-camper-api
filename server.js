import express from 'express';
import dotenv from 'dotenv';
import bootcampsRoutes from './routes/bootcampsRoutes.js';
import morgan from 'morgan';

dotenv.config({ path: './config/config.env' });
const PORT = process.env.PORT || 5000;

const app = express();

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.get('/', (req, res) => res.send(`API is running on ${PORT}`));
app.use('/api/v1/bootcamps', bootcampsRoutes);

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
