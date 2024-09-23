```js
// Part 2 Filter
// GET /experience-products?countryOfOrigin=US
app.get('/experience-products', async (req, res) => {
    const { countryOfOrigin } = req.query; // Retrieve countryOfOrigin from query parameters

    let filter = {};
    if (countryOfOrigin) {
        filter.countryOfOrigin = countryOfOrigin; // Construct a filter if countryOfOrigin is provided
    }

    try {
        const products = await ExperienceProduct.findAll({
            where: filter, // Apply the filter
            attributes: ['id', 'name', 'price', 'description']
        });
        res.json(products);
    } catch (error) {
        console.error('Failed to fetch products:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});```
