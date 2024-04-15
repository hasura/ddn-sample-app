```js
// Part 8 - Nested Sorting (same database)
// GET /experience-products?countryOfOrigin=US&categoryName=T-Shirts&categorySort=DESC&offset=1&limit=5


app.get('/experience-products', async (req, res) => {
    const { countryOfOrigin, categoryName, categorySort = 'ASC', offset = 1, limit = 5 } = req.query;
    
    try {
        // Fetch experience products with filters and user-defined nested sorting
        const products = await ExperienceProduct.findAll({
            where: {
                countryOfOrigin
            },
            include: [
                {
                    model: Category,
                    attributes: ['name'],
                    where: categoryName ? { name: categoryName } : undefined
                },
                {
                    model: Manufacturer,
                    attributes: ['name']
                }
            ],
            order: [
                [{ model: Category, as: 'Category' }, 'name', categorySort.toUpperCase()]  // Sorting direction from user input
            ],
            offset: parseInt(offset, 10),
            limit: parseInt(limit, 10)

    //  rest same as above
```
