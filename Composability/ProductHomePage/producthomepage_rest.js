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
});

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

// Part 6 - Two Level Nested cross database joins
// Fetch Experience Products
// GET http://localhost:3000/experience-products?countryOfOrigin=US&sort=price:desc&offset=1&limit=5
// Fetch Categories for Each Product
// GET http://localhost:3000/categories?productId=123
// You might need to make multiple calls depending on the number of products:
// Fetch Manufacturers for Each Product
// GET http://localhost:3000/manufacturers?productId=123
// Fetch Orders Related to Each Product
// GET http://localhost:3000/orders?productId=123
// Fetch Users for Each Order
// GET http://localhost:3000/users?orderId=456

// Implementation Challenges and Considerations

//     Multiple HTTP Requests: This approach requires multiple network calls, which can lead to higher latency compared to a single GraphQL call.
//     Data Aggregation: The client-side or an intermediate service must aggregate data from these calls to form a cohesive structure.
//     Efficiency: Multiple calls can be inefficient in terms of performance and bandwidth usage.


const express = require('express');
const { ExperienceProduct, Category, Manufacturer } = require('./models/db1Models');
const { Order } = require('./models/db2Models');
const { User } = require('./models/db3Models');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/experience-products', async (req, res) => {
    const { countryOfOrigin, sort, offset, limit } = req.query;

    let order = sort ? [sort.split(':').map((item, index) => index === 1 ? item.toUpperCase() : item)] : [];

    try {
        const products = await ExperienceProduct.findAll({
            where: { countryOfOrigin },
            include: [{
                model: Category,
                attributes: ['name']
            }, {
                model: Manufacturer,
                attributes: ['name']
            }],
            order,
            offset: parseInt(offset, 10) || 0,
            limit: parseInt(limit, 10) || 10
        });

        // Fetch orders for the retrieved products
        const productIds = products.map(p => p.id);
        const orders = await Order.findAll({
            where: { productId: productIds },
            include: [{
                model: User,
                attributes: ['name']
            }],
            attributes: ['createdAt', 'deliveryDate', 'status']
        });

        // Map orders back to products
        const results = products.map(product => ({
            ...product.toJSON(),
            orders: orders.filter(order => order.productId === product.id)
        }));

        res.json(results);
    } catch (error) {
        console.error('Failed to fetch products and orders:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Chaining Resolvers

// GET /experience-products

// countryOfOrigin (required)
// offset (optional, default 1)
// limit (optional, default 5)

// the GET /experience-products endpoint, as designed, can fetch fields from different databases, 
// assuming that your Sequelize models are correctly set up to connect to these various databases. 
// This setup requires each model to be connected to its respective database using separate 
// Sequelize instances, and you would handle data fetching within the same endpoint using promises 
// to manage asynchronous operations effectively.

const express = require('express');
const { ExperienceProduct, Category, Manufacturer, Order, User } = require('./models');

app.get('/experience-products', async (req, res) => {
    try {
        const { countryOfOrigin, offset = 1, limit = 5 } = req.query;

        // Fetch experience products with filtering and pagination
        const products = await ExperienceProduct.findAll({
            where: { countryOfOrigin: countryOfOrigin },
            order: [['price', 'DESC']],
            offset: parseInt(offset, 10),
            limit: parseInt(limit, 10)
        });

        // Fetch related data for each product in parallel
        const detailedProducts = await Promise.all(products.map(async (product) => {
            const category = await Category.findOne({ where: { productId: product.id } });
            const manufacturer = await Manufacturer.findOne({ where: { productId: product.id } });
            const orders = await Order.findAll({ where: { productId: product.id } });

            // Fetch related users for each order
            const ordersWithUsers = await Promise.all(orders.map(async (order) => {
                const users = await User.findAll({ where: { orderId: order.id } });
                return { ...order.toJSON(), users };
            }));

            return {
                ...product.toJSON(),
                category: category ? category.name : null,
                manufacturer: manufacturer ? manufacturer.name : null,
                orders: ordersWithUsers
            };
        }));

        res.json(detailedProducts);
    } catch (error) {
        console.error('Failed to fetch products:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Adding a new field

// Update Model Definitions: If the new field is part of a database table, first ensure that your Sequelize model reflects this new field. You may need to update the model definition to include this field.

// Modify Data Fetching Logic: Update the part of your endpoint's code where data is being fetched to include the new field. This could mean:
//     Adding the field to the list of attributes fetched in a Sequelize findAll() or findOne() call.
//     If the new field is from a related entity, ensure that the entity is included in the query, and specify the new field in the attributes array of the include option.

// Adjust Response Construction: Ensure that the response object being constructed includes the new field. This might involve adding the field to an object spread or explicitly setting the field on the response object.

const ordersWithUsers = await Promise.all(orders.map(async (order) => {
    const users = await User.findAll({
        where: { orderId: order.id },
        attributes: ['name', 'email'] // Adding the 'email' field here
    });
    return { ...order.toJSON(), users };
}));

// Performance Improvements

// Batch Processing for Orders and Users: By using the [Op.in] operator, we can fetch all relevant orders and users in just two queries—regardless of the number of products or orders. This is much more efficient than making a query for each product or order individually.

// Hashmap for User Mapping: Creating a hashmap to link users to their respective orders allows quick lookup and mapping without additional processing time for filtering through arrays.

// Maintaining Functional Integrity: The improved code still adheres to all functional requirements, including filtering, sorting, and pagination, while enhancing performance.

const express = require('express');
const { ExperienceProduct, Category, Manufacturer, Order, User } = require('./models');
const { Op } = require('sequelize');

app.get('/experience-products', async (req, res) => {
    const { countryOfOrigin, sort, offset, limit } = req.query;
    let orderSort = sort ? [sort.split(':').map((item, index) => index === 1 ? item.toUpperCase() : item)] : [];

    try {
        const products = await ExperienceProduct.findAll({
            where: { countryOfOrigin },
            include: [
                { model: Category, attributes: ['name'] },
                { model: Manufacturer, attributes: ['name'] }
            ],
            order: orderSort,
            offset: parseInt(offset, 10) || 0,
            limit: parseInt(limit, 10) || 10
        });

        // Fetch orders for all retrieved products in one query using batch processing
        const productIds = products.map(p => p.id);
        const orders = await Order.findAll({
            where: { productId: { [Op.in]: productIds } },
            attributes: ['createdAt', 'deliveryDate', 'status', 'productId', 'id']
        });

        // Fetch all users related to these orders in one query using batch processing
        const orderIds = orders.map(order => order.id);
        const users = await User.findAll({
            where: { orderId: { [Op.in]: orderIds } },
            attributes: ['name', 'orderId']
        });

        // Map users back to orders using a hashmap for efficiency
        const userMap = users.reduce((map, user) => {
            if (!map[user.orderId]) map[user.orderId] = [];
            map[user.orderId].push(user);
            return map;
        }, {});

        // Map orders to products
        const results = products.map(product => ({
            ...product.toJSON(),
            orders: orders.filter(order => order.productId === product.id)
                .map(order => ({
                    ...order.toJSON(),
                    users: userMap[order.id] || []
                }))
        }));

        res.json(results);
    } catch (error) {
        console.error('Failed to fetch products and orders:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

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

        //  rest same as above

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


    // # Part 9 Nested paginate (top N)

    // GET http://localhost:3000/experience-products?countryOfOrigin=US&categoryName=T-Shirts&categorySort=ASC&offset=1&limit=5&reviewDateAfter=2023-10-15

    const express = require('express');
    const { Sequelize, Op } = require('sequelize');
    const { ExperienceProduct, Category, Manufacturer, Order, User, Review } = require('./models');

    
    app.get('/experience-products', async (req, res) => {
        const {
            countryOfOrigin = 'US',  // Default value if not specified
            categoryName = 'T-Shirts',  // Default value if not specified
            categorySort = 'ASC',  // Default sorting order if not specified
            offset = 0,  // Default offset if not specified
            limit = 5,  // Default limit if not specified
            reviewDateAfter = "2023-01-01"  // Default review date if not specified
        } = req.query;
    
        try {
            const products = await ExperienceProduct.findAll({
                where: { countryOfOrigin },
                include: [
                    {
                        model: Category,
                        where: { name: categoryName },
                        attributes: ['name'],
                        required: true
                    },
                    {
                        model: Manufacturer,
                        attributes: ['name'],
                        required: false
                    }
                ],
                order: [
                    [{ model: Category, as: 'categories' }, 'name', categorySort]
                ],
                offset: parseInt(offset),
                limit: parseInt(limit)
            });
    
            const productIds = products.map(p => p.id);
    
            // Fetch orders and include users in the same query
            const orders = await Order.findAll({
                where: { productId: { [Op.in]: productIds } },
                include: [{
                    model: User,
                    attributes: ['name'],
                    required: false
                }],
                attributes: ['createdAt', 'deliveryDate', 'status', 'productId']
            });
    
            const reviews = await Review.findAll({
                where: {
                    productId: { [Op.in]: productIds },
                    createdAt: { [Op.gt]: reviewDateAfter }
                },
                limit: 3,
                order: [['rating', 'DESC']],
                attributes: ['rating', 'text']
            });
    
            const productWithReviews = products.map(product => ({
                ...product.toJSON(),
                orders: orders.filter(order => order.productId === product.id).map(order => ({
                    ...order.toJSON(),
                    users: order.Users.map(user => user.toJSON()) // Mapping users for each order
                })),
                reviews: reviews.filter(review => review.productId === product.id)
            }));
    
            res.json(productWithReviews);
        } catch (error) {
            console.error('Failed to fetch products:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    });

//   Let’s say we want to query orders of the products: 

const products = await Product.findAll({ ...

    const reviews = await Review.findAll({ where: productId: {[Op.in]: productIds ...

    const orders = await Orders.findAll({ where: productId: {[Op.in]: productIds ...


//  Now you realize categories are only being fetched after resolving the reviews but technically the categories are not dependent on reviews. 
// You may now optimize to parallelize these queries: 


// Get product ids first 
const products = await Product.findAll({ ...

// Execute promises in parallel using Promise.all()
const [reviews, categories]= await Promise.all([
const reviews = await Review.findAll({ where: productId: {[Op.in]: productIds ...

const categories = await Categoreis.findAll({ where: productId: {[Op.in]: productIds ...


const express = require('express');
const { Sequelize, Op } = require('sequelize');
const { ExperienceProduct, Category, Manufacturer, Order, User, Review } = require('./models');

app.get('/experience-products', async (req, res) => {
    const {
        countryOfOrigin = 'US',  // Default value if not specified
        categoryName = 'T-Shirts',  // Default value if not specified
        categorySort = 'ASC',  // Default sorting order if not specified
        offset = 0,  // Default offset if not specified
        limit = 5,  // Default limit if not specified
        reviewDateAfter = "2023-01-01"  // Default review date if not specified
    } = req.query;

    try {
        // First fetch the products
        const products = await ExperienceProduct.findAll({
            where: { countryOfOrigin },
            include: [
                { model: Category, where: { name: categoryName }, attributes: ['name'], required: true },
                { model: Manufacturer, attributes: ['name'], required: false }
            ],
            order: [[{ model: Category, as: 'categories' }, 'name', categorySort]],
            offset: parseInt(offset),
            limit: parseInt(limit)
        });

        const productIds = products.map(p => p.id);

        // Fetch orders, users, and reviews in parallel using Promise.all
        const [orders, reviews] = await Promise.all([
            Order.findAll({
                where: { productId: { [Op.in]: productIds } },
                include: { model: User, attributes: ['name'], required: false },
                attributes: ['createdAt', 'deliveryDate', 'status', 'productId']
            }),
            Review.findAll({
                where: {
                    productId: { [Op.in]: productIds },
                    createdAt: { [Op.gt]: reviewDateAfter }
                },
                limit: 3,
                order: [['rating', 'DESC']],
                attributes: ['rating', 'text']
            })
        ]);

        // Mapping orders to include users
        const ordersWithUsers = orders.map(order => ({
            ...order.toJSON(),
            users: order.Users ? order.Users.map(user => user.toJSON()) : []
        }));

        // Assemble the final product data including the nested data
        const productWithDetails = products.map(product => ({
            ...product.toJSON(),
            orders: ordersWithUsers.filter(order => order.productId === product.id),
            reviews: reviews.filter(review => review.productId === product.id)
        }));

        res.json(productWithDetails);
    } catch (error) {
        console.error('Failed to fetch products:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// Performance Improvement: By fetching orders and reviews concurrently after the initial product query, the API minimizes wait time associated with sequential database access.
// Simplicity and Maintainability: Although adding parallel operations, the use of Promise.all keeps the logic straightforward and maintainable.