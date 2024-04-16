```js
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
// Simplicity and Maintainability: Although adding parallel operations, the use of Promise.all keeps the logic straightforward and maintainable.```
