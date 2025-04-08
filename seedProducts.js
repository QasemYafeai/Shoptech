// seedProducts.js
const mongoose = require('mongoose');
require('dotenv').config(); 
const { connectToDB } = require('./dbConnection');
const Product = require('./models/Product');

const productsData = [
{
    name: 'Microsoft Office 2021 Professional Plus (PC) key',
    category: 'Microsoft Office',
    price: 100,
    image: '/images/office2021professionalplus.png',
},

  {
    name: 'Microsoft Office 2021 Professional Plus for 2 PC',
    category: 'Microsoft Office',
    price: 120,
    image: '/images/office2021professionalplus.png', 
  },
  {
    name: 'Microsoft Office 2021 Professional Plus for 3 PC',
    category: 'Microsoft Office',
    price: 150,
    image: '/images/office2021professionalplus.png',
  },
  {
    name: 'Windows 11 Pro key',
    category: 'Windows',
    price: 70,
    image: '/images/windows11pro.png',
  },
  {
    name: 'Kaspersky Total Security 2025 1 PC 1 Year Global Key',
    category: 'Kaspersky',
    price: 30,
    image: '/images/KTStotal2025.png',
  },
  {
    name: 'McAfee total protection 2024 1 device 1 year global',
    category: 'McAfee',
    price: 30,
    image: '/images/mcafeetotalprotection.png',
  },
];

async function seed() {
  try {
    await connectToDB();

    // Clear existing products if you want a fresh start
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert all products
    const inserted = await Product.insertMany(productsData);
    console.log('Successfully seeded products:', inserted);

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.');
  }
}

seed();
