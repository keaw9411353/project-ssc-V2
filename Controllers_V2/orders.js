const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new order
const createOrder = async (req, res) => {
    const { UserID, OrderDate, TotalAmount, OrderStatus, phonenumber, shipping_address, orderdetails } = req.body;

    try {
        const newOrder = await prisma.orders.create({
            data: {
                UserID,
                OrderDate,
                TotalAmount,
                OrderStatus,
                phonenumber,
                shipping_address,
                orderdetail: {
                    create: orderdetails // Array of order details to be created
                }
            }
        });
        res.status(201).json({
            status: 'ok',
            message: 'Order created successfully',
            newOrder
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to create order',
            error
        });
    }
};

// Get all orders
const getAllOrders = async (req, res) => {
    try {
        const orders = await prisma.orders.findMany({
            include: {
                orderdetail: true, // Fetch related order details
                payment: true,     // Fetch related payment details
            }
        });
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch orders',
            error
        });
    }
};


// Get a single order by ID
const getOrderById = async (req, res) => {
    const { orderId } = req.params;

    try {
        const order = await prisma.orders.findUnique({
            where: {
                OrderID: parseInt(orderId, 10)
            },
            include: {
                orderdetail: true, // Fetch related order details
                payment: true,     // Fetch related payment details
            }
        });

        if (!order) {
            return res.status(404).json({
                status: 'error',
                message: 'Order not found'
            });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch order',
            error
        });
    }
};


// Update an order
const updateOrder = async (req, res) => {
    const { orderId } = req.params;
    const { UserID, OrderDate, TotalAmount, OrderStatus, phonenumber, shipping_address } = req.body;

    const data = {};
    if (UserID) data.UserID = UserID;
    if (OrderDate) data.OrderDate = OrderDate;
    if (TotalAmount) data.TotalAmount = TotalAmount;
    if (OrderStatus) data.OrderStatus = OrderStatus;
    if (phonenumber) data.phonenumber = phonenumber;
    if (shipping_address) data.shipping_address = shipping_address;

    try {
        const updatedOrder = await prisma.orders.update({
            where: { OrderID: parseInt(orderId, 10) },
            data
        });

        res.status(200).json({
            status: 'ok',
            message: `Order with ID = ${orderId} is updated`,
            updatedOrder
        });
    } catch (err) {
        if (err.code === 'P2025') {
            res.status(404).json({
                status: 'error',
                message: `Order with ID = ${orderId} not found`
            });
        } else {
            console.error('Update order error:', err);
            res.status(500).json({
                status: 'error',
                message: 'An unexpected error occurred'
            });
        }
    }
};


// Delete an order
const deleteOrder = async (req, res) => {
    const { orderId } = req.params;

    try {
        const deletedOrder = await prisma.orders.delete({
            where: { OrderID: parseInt(orderId, 10) }
        });

        res.status(200).json({
            status: 'ok',
            message: `Order with ID = ${orderId} is deleted`,
            deletedOrder
        });
    } catch (err) {
        if (err.code === 'P2025') {
            res.status(404).json({
                status: 'error',
                message: `Order with ID = ${orderId} not found`
            });
        } else {
            console.error('Delete order error:', err);
            res.status(500).json({
                status: 'error',
                message: 'An unexpected error occurred'
            });
        }
    }
};


module.exports = { createOrder, getAllOrders, getOrderById, updateOrder, deleteOrder};
