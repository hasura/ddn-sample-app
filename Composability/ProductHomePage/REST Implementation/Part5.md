```js
// Part 5 - Same Database Joins
// GET/ experience-products?countryOfOrigin=US&sort=price:desc&offset=1&limit=5&categoryFields=name,description&manufacturerFields=name,location


// Define Relationships in Sequelize Models

// models/ExperienceProduct.js
const Category = require('./Category');
const Manufacturer = require('./Manufacturer');

ExperienceProduct.belongsTo(Category, {foreignKey: 'categoryId'});
ExperienceProduct.belongsTo(Manufacturer, {foreignKey: 'manufacturerId'});

// nodeJs implementation

const express = require('express');
const ExperienceProduct = require('./models/ExperienceProduct');
const Category = require('./models/Category');
const Manufacturer = require('./models/Manufacturer');

app.get('/experience-products', async (req, res) => {
    const {
        countryOfOrigin,
        sort,
        offset,
        limit,
        categoryFields,
        manufacturerFields
    } = req.query;

    let filter = {};
    if (countryOfOrigin) {
        filter.countryOfOrigin = countryOfOrigin;
    }

    let order = [];
    if (sort) {
        const [field, direction] = sort.split(':');
        order.push([field, direction.toUpperCase()]);
    }

    // Prepare dynamic field selection
    const categoryAttributes = categoryFields ? categoryFields.split(',') : ['name'];
    const manufacturerAttributes = manufacturerFields ? manufacturerFields.split(',') : ['name'];

    try {
        const products = await ExperienceProduct.findAll({
            where: filter,
            attributes: ['id', 'name', 'price', 'description'],
            include: [
                {
                    model: Category,
                    attributes: categoryAttributes,
                    required: false  // Specifies that the join should not enforce presence
                },
                {
                    model: Manufacturer,
                    attributes: manufacturerAttributes,
                    required: false  // Same as above, to allow flexibility
                }
            ],
            order: order,
            offset: parseInt(offset, 10) || 0,  // Parse the offset or use 0 as default
            limit: parseInt(limit, 10) || 10    // Parse the limit or use 10 as default
        });
        res.json(products);
    } catch (error) {
        console.error('Failed to fetch products:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
// Dynamic Field Selection: As before, this version allows clients to dynamically select which fields to include from the related models.
// Filtering, Sorting, and Pagination: These features are robustly integrated to work alongside dynamic field selection, providing a flexible API that can handle complex queries.
```
