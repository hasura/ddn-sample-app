```js
// Part 3 Sorting
// GET /experience-products?countryOfOrigin=US&sort=price:desc

app.get('/experience-products', async (req, res) => {
    const { countryOfOrigin, sort } = req.query; // Retrieve countryOfOrigin and sort from query parameters

    let filter = {};
    if (countryOfOrigin) {
        filter.countryOfOrigin = countryOfOrigin; // Construct a filter if countryOfOrigin is provided
    }

    let order = [];
    if (sort) {
        const [field, direction] = sort.split(':'); // Assumes sort parameter is in the form 'field:direction'
        order.push([field, direction.toUpperCase()]); // Add ordering criteria to the query
    }

    try {
        const products = await ExperienceProduct.findAll({
            where: filter,
            attributes: ['id', 'name', 'price', 'description'],
            order: order // Apply the ordering
        });
        res.json(products);
    } catch (error) {
        console.error('Failed to fetch products:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Sorting Parameter: The endpoint now accepts a sort query parameter in addition to countryOfOrigin. The sort parameter should be formatted as field:direction (e.g., price:desc).
// Ordering Logic: The order array in Sequelize's findAll method controls the order of results. If the sort parameter is provided, it's split into the field to sort by and the direction (asc or desc), and this order is applied to the query.
```
