import fs from 'fs';
import * as url from 'url';
import mongoose from 'mongoose';
import chalk from 'chalk';
import dotenv from 'dotenv';
import Bootcamp from './models/Bootcamp.js';
import Course from './models/Course.js';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {});

// Read JSON files
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
);

const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8')
);

// Import into DB
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    // await Course.create(courses);

    console.log(chalk.green('Data Imported 🎉'));
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// Delete data from DB
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();

    console.log(chalk.red('Data Destroyed 💥'));
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
