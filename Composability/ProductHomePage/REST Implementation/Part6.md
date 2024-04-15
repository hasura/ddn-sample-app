```js
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
});```
