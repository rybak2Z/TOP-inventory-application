#! /usr/bin/env node

console.log(
  'This script populates some test data to the database. Specify database URI and database name as "MONGODB_URI" and "DB_NAME" environment variables.',
);

require('dotenv').config();
const mongoose = require('mongoose');
const Stick = require('./models/stick');
const Category = require('./models/category');

const categories = [];

main().catch((err) => console.log(err));

async function main() {
  await connectToDb();
  await createCategories(); // must come before sticks, bc sticks reference categories
  await createSticks();
  console.log('Closing mongoose...');
  mongoose.connection.close();
}

async function connectToDb() {
  mongoose.set('strictQuery', false);
  const mongoDbUri = process.env.MONGODB_URI;
  const databaseName = process.env.DB_NAME;
  console.log('Connecting to database...');
  await mongoose.connect(mongoDbUri, { dbName: databaseName });
  console.log('Connected.');
}

async function createSingleStick(name, category, price, has_image) {
  const stick = new Stick({
    name,
    category,
    price,
    has_image,
  });
  await stick.save();
  console.log(`Created stick ${name}`);
}

// Pass index to save in global array so that they can always be referenced
// in predetermined order, no matter in what order the promises finish
async function createSingleCategory(index, name) {
  const category = new Category({ name });
  await category.save();
  categories[index] = category;
  console.log(`Created category ${name}`);
}

async function createSticks() {
  console.log('Creating sticks...');
  await Promise.all([
    createSingleStick('Stick gun #1', categories[0], 5, false),
    createSingleStick('Stick gun #2', categories[0], 7, false),
    createSingleStick('Stick rifle #1', categories[1], 15, false),
    createSingleStick('Stick rifle #2', categories[1], 12, false),
    createSingleStick('Stick sword #1', categories[2], 20, false),
    createSingleStick('Stick dagger #1', categories[3], 5, false),
    createSingleStick('Stick other #1', categories[4], 10, false),
  ]);
}

async function createCategories() {
  console.log('Creating categories...');
  await Promise.all([
    createSingleCategory(0, 'Guns'),
    createSingleCategory(1, 'Rifles'),
    createSingleCategory(2, 'Swords'),
    createSingleCategory(3, 'Daggers'),
    createSingleCategory(4, 'Other'),
  ]);
}
