```js
// Part 1 (Select List)
// GET /experience-products

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('database_name', 'username', 'password', {
    host: 'localhost',
    dialect: 'postgres'
});

const ExperienceProduct = sequelize.define('ExperienceProduct', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING
    },
    countryOfOrigin: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'experience_products'
});

// Full Express App Example (app.js)

module.exports = ExperienceProduct;
const express = require('express');
const ExperienceProduct = require('./models/ExperienceProduct');

app.get('/experience-products', async (req, res) => {
    try {
        const products = await ExperienceProduct.findAll({
            attributes: ['id', 'name', 'price', 'description']
        });
        res.json(products);
    } catch (error) {
        console.error('Failed to fetch products:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Explanation of the REST Endpoint

//     GET /experience-products: This endpoint fetches all entries from the experience_products table. It uses Sequelize's findAll() method, specifying which attributes to retrieve, which matches the fields requested in the GraphQL query.
//     Error Handling: It includes error handling to respond with a 500 status code in case of any internal errors during the fetch operation.
//     Server Setup: The code initializes an Express server and listens on a specified port.

// This example translates the GraphQL query into a RESTful model, utilizing the simplicity of REST combined with the structure and robustness of using an ORM like Sequelize for database interactions.
```
