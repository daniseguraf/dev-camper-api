import mongoose from 'mongoose';
import chalk from 'chalk';

const connectDB = async () => {
  try {
    console.log(process.env.MONGO_URI);
    const conn = await mongoose.connect(process.env.MONGO_URI, {});

    console.log(
      chalk.bold.underline.cyan(`Mongo connected: ${conn.connection.host}`)
    );
  } catch (error) {
    console.error(chalk.bgRed(`Error: ${error.message}`));
    process.exit(1);
  }
};

export default connectDB;
