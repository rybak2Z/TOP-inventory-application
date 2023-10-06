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

async function createSingleStick(name, category, price, image_file_name) {
  const stick = new Stick({
    name,
    category,
    price,
    image_file_name,
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
    createSingleStick('Pistol 1', categories[0], 50, 'pistol1-0.webp'),
    createSingleStick('Pistol 2', categories[0], 35, 'pistol2-0.webp'),
    createSingleStick('Pistol 3', categories[0], 60, 'pistol3-0.webp'),
    createSingleStick('Sword 1', categories[1], 110, 'sword1-0.webp'),
    createSingleStick('Sword 2', categories[1], 90, 'sword2-0.webp'),
    createSingleStick('Sword 3', categories[1], 130, 'sword3-0.webp'),
    createSingleStick('Straight 1', categories[2], 20, 'straight1-0.webp'),
    createSingleStick('Straight 2', categories[2], 15, 'straight2-0.webp'),
    createSingleStick(
      'Machine Pistol',
      categories[3],
      100,
      'machine-pistol1-0.webp',
    ),
    createSingleStick('Musket', categories[3], 150, 'musket1-0.webp'),
    createSingleStick('Revolver', categories[3], 70, 'revolver1-0.webp'),
    createSingleStick('Shotgun', categories[3], 110, 'shotgun1-0.webp'),
  ]);
}

async function createCategories() {
  console.log('Creating categories...');
  await Promise.all([
    createSingleCategory(0, 'Pistols'),
    createSingleCategory(1, 'Swords'),
    createSingleCategory(2, 'Straight Sticks'),
    createSingleCategory(3, 'Other'),
  ]);
}
