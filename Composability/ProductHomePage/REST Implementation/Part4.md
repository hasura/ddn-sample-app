```js
// Part 4  Pagination
// GET experience-products?countryOfOrigin=US&sort=price:desc&offset=1&limit=5

app.get('/experience-products', async (req, res) => {
    const { countryOfOrigin, sort, offset, limit } = req.query; // Retrieve pagination and sorting parameters

    let filter = {};
    if (countryOfOrigin) {
        filter.countryOfOrigin = countryOfOrigin;
    }

    let order = [];
    if (sort) {
        const [field, direction] = sort.split(':');
        order.push([field, direction.toUpperCase()]);
    }

    try {
        const products = await ExperienceProduct.findAll({
            where: filter,
            attributes: ['id', 'name', 'price', 'description'],
            order: order,
            offset: parseInt(offset, 10) || 0, // Use offset from the query or default to 0
            limit: parseInt(limit, 10) || 10 // Use limit from the query or default to 10
        });
        res.json(products);
    } catch (error) {
        console.error('Failed to fetch products:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Offset and Limit: These are common pagination controls:
// offset: This parameter specifies from what row to start fetching the data. This is useful for skipping a certain number of records.
// limit: This parameter controls the maximum number of records to return.
// Parsing Query Parameters: The offset and limit are parsed from the query string, converted from strings to integers. If they are not provided, default values are used (0 for offset and 10 for limit).
```
