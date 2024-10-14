const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new order detail
const createOrderDetail = async (req, res) => {
    const { OrderID, Products_id, Quantity, UnitPrice } = req.body;

    try {
        const newOrderDetail = await prisma.orderdetails.create({
            data: {
                OrderID,
                Products_id,
                Quantity,
                UnitPrice
            }
        });
        res.status(201).json({
            status: 'ok',
            message: 'Order detail created successfully',
            newOrderDetail
        });
    } catch (error) {
        console.error('Error creating order detail:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to create order detail',
            error
        });
    }
};

// Get all order details
const getAllOrderDetails = async (req, res) => {
    try {
        const orderDetails = await prisma.orderdetails.findMany();
        res.status(200).json(orderDetails);
    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch order details',
            error
        });
    }
};

// Get a single order detail by ID
const getOrderDetailById = async (req, res) => {
    const { orderDetailId } = req.params;

    try {
        const orderDetail = await prisma.orderdetails.findUnique({
            where: {
                OrdersDetailID: parseInt(orderDetailId, 10)
            }
        });

        if (!orderDetail) {
            return res.status(404).json({
                status: 'error',
                message: 'Order detail not found'
            });
        }

        res.status(200).json(orderDetail);
    } catch (error) {
        console.error('Error fetching order detail:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch order detail',
            error
        });
    }
};

// Update an order detail
const updateOrderDetail = async (req, res) => {
    const { orderDetailId } = req.params;
    const { OrderID, Products_id, Quantity, UnitPrice } = req.body;

    const data = {};
    if (OrderID) data.OrderID = OrderID;
    if (Products_id) data.Products_id = Products_id;
    if (Quantity) data.Quantity = Quantity;
    if (UnitPrice) data.UnitPrice = UnitPrice;

    try {
        const updatedOrderDetail = await prisma.orderdetails.update({
            where: { OrdersDetailID: parseInt(orderDetailId, 10) },
            data
        });

        res.status(200).json({
            status: 'ok',
            message: `Order detail with ID = ${orderDetailId} is updated`,
            updatedOrderDetail
        });
    } catch (err) {
        if (err.code === 'P2025') {
            res.status(404).json({
                status: 'error',
                message: `Order detail with ID = ${orderDetailId} not found`
            });
        } else {
            console.error('Update order detail error:', err);
            res.status(500).json({
                status: 'error',
                message: 'An unexpected error occurred',
                error: err.message
            });
        }
    }
};

// Delete an order detail
const deleteOrderDetail = async (req, res) => {
    const { orderDetailId } = req.params;

    try {
        // ตรวจสอบว่ามีการส่ง orderDetailId มาและเป็นตัวเลข
        if (!orderDetailId) {
            return res.status(400).json({
                status: 'error',
                message: 'orderDetailId is required'
            });
        }

        const parsedOrderDetailId = parseInt(orderDetailId, 10);

        if (isNaN(parsedOrderDetailId)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid orderDetailId, it must be an integer'
            });
        }

        // ลบ order detail โดยใช้ parsedOrderDetailId
        const deletedOrderDetail = await prisma.orderdetails.delete({
            where: { 
                OrdersDetailID: parsedOrderDetailId
            }
        });

        res.status(200).json({
            status: 'ok',
            message: `Order detail with ID = ${parsedOrderDetailId} is deleted`,
            deletedOrderDetail
        });
    } catch (err) {
        if (err.code === 'P2025') {
            res.status(404).json({
                status: 'error',
                message: `Order detail with ID = ${orderDetailId} not found`
            });
        } else {
            console.error('Delete order detail error:', err);
            res.status(500).json({
                status: 'error',
                message: 'An unexpected error occurred',
                error: err.message
            });
        }
    }
};



module.exports = { createOrderDetail, getAllOrderDetails, getOrderDetailById, updateOrderDetail, deleteOrderDetail };
