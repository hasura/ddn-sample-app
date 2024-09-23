```js
// # Part 7 - Nested Filtering (same database)

//  experience-products?countryOfOrigin=US&categoryName=T-Shirts&sort=price:desc&offset=1&limit=5

// Include categoryName in the Query Parameters:
// This will be taken from the request's query string to allow filtering by the category name.

// Adjusting the ExperienceProduct.findAll Call:
// Add a condition for filtering products by the category name through the include option.

// Query Parameters: Added categoryName to the list of query parameters to allow filtering by category name.
// Nested Filtering: Included a nested where clause in the Category inclusion within the ExperienceProduct.findAll call. This effectively filters products not just by countryOfOrigin but also by the name of the category.
// Conditional Inclusion: The category filter within the inclusion is conditional, based on whether categoryName is provided, ensuring flexibility in filtering.

app.get('/experience-products', async (req, res) => {
    const { countryOfOrigin, categoryName, sort, offset, limit } = req.query;
    let orderSort = sort ? [sort.split(':').map((item, index) => index === 1 ? item.toUpperCase() : item)] : [];

    try {
        // Build where clause for products and nested categories
        const productWhere = {
            countryOfOrigin,
            '$Category.name$': categoryName // Sequelize syntax for filtering on included model properties
        };

        // Remove any undefined filters
        Object.keys(productWhere).forEach(key => productWhere[key] === undefined && delete productWhere[key]);

        const products = await ExperienceProduct.findAll({
            where: productWhere,
            include: [
                { model: Category, attributes: ['name'], where: categoryName ? { name: categoryName } : undefined },
                { model: Manufacturer, attributes: ['name'] }
            ],
            order: orderSort,
            offset: parseInt(offset, 10) || 0,
            limit: parseInt(limit, 10) || 10
        });

        //  rest same as above```
