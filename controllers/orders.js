const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ฟังก์ชันสำหรับการสร้างข้อมูล orders ใหม่
const createOrder = async (req, res) => {
    const { OrderID, CustomerID, OrderDate, TotalAmount } = req.body; // ดึงข้อมูลจาก body ของ request
    try {
        const order = await prisma.orders.create({
            data: {
                OrderID,
                CustomerID,
                OrderDate,
                TotalAmount,
            },
        });
        res.status(200).json(order); // ส่งข้อมูลของ order ที่สร้างใหม่กลับไปยัง client
    } catch (err) {
        res.status(500).json(err); // ส่งสถานะ 500 เมื่อเกิดข้อผิดพลาด
    }
};

// ฟังก์ชันสำหรับการอัปเดตข้อมูล orders
const updateOrder = async (req, res) => {
    const { OrderID, CustomerID, OrderDate, TotalAmount } = req.body; // ดึงข้อมูลจาก body ของ request
    try {
        const order = await prisma.orders.update({
            data: {
                OrderID,
                CustomerID,
                OrderDate,
                TotalAmount,
            },
            where: { ID: Number(req.params.ID) } // ค้นหาข้อมูลตาม ID
        });

        res.status(200).json(order); // ส่งข้อมูลที่อัปเดตกลับไปยัง client
    } catch (err) {
        res.status(500).json({ error: err.message }); // ส่งข้อผิดพลาดเมื่อเกิดข้อผิดพลาด
    }
};

// ฟังก์ชันสำหรับลบข้อมูล orders
const deleteOrder = async (req, res) => {
    const ID = req.params.ID; // รับค่า ID จาก URL
    try {
        const orderExists = await prisma.orders.findUnique({
            where: { ID: Number(ID) }, // ตรวจสอบว่าข้อมูลที่ต้องการลบมีอยู่หรือไม่
        });

        if (!orderExists) {
            return res.status(404).json({ error: 'Order not found' }); // ถ้าไม่มีข้อมูลส่งสถานะ 404
        }

        const deletedOrder = await prisma.orders.delete({
            where: { ID: Number(ID) }, // ลบข้อมูลตาม ID
        });

        res.status(200).json({ message: 'Order deleted successfully', deletedOrder }); // ส่งข้อมูลการลบสำเร็จกลับไปยัง client
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete order', details: err }); // ส่งสถานะ 500 เมื่อเกิดข้อผิดพลาด
    }
};

// ฟังก์ชันสำหรับดึงข้อมูล orders ทั้งหมด
const getOrders = async (req, res) => {
    try {
        const orders = await prisma.orders.findMany(); // ดึงข้อมูลทั้งหมดจากตาราง orders
        res.json(orders); // ส่งข้อมูลกลับไปยัง client
    } catch (err) {
        res.status(500).json({ error: err.message }); // ส่งข้อผิดพลาดเมื่อเกิดข้อผิดพลาด
    }
};

// ฟังก์ชันสำหรับดึงข้อมูล orders ตาม ID
const getOrderByID = async (req, res) => {
    const ID = req.params.ID; // รับค่า ID จาก URL
    try {
        const order = await prisma.orders.findUnique({
            where: { ID: Number(ID) }, // ค้นหาข้อมูลตาม ID
        });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' }); // ถ้าไม่พบข้อมูลส่งสถานะ 404
        } else {
            res.status(200).json(order); // ส่งข้อมูลกลับไปยัง client
        }
    } catch (err) {
        res.status(500).json(err); // ส่งสถานะ 500 เมื่อเกิดข้อผิดพลาด
    }
};

// ฟังก์ชันสำหรับค้นหาข้อมูล orders ตามคำค้น (term)
const getOrderByTerm = async (req, res) => {
    const searchString = req.params.term; // รับคำค้นจาก URL
    try {
        const orders = await prisma.orders.findMany({
            where: {
                OR: [
                    {
                        CustomerID: {
                            contains: searchString // ค้นหาข้อมูลที่มี CustomerID ตรงกับคำค้น
                        }
                    },
                    {
                        OrderID: {
                            contains: searchString // ค้นหาข้อมูลที่มี OrderID ตรงกับคำค้น
                        }
                    }
                ]
            },
        });
        if (!orders || orders.length === 0) {
            res.status(404).json({ message: 'No orders found!' }); // ถ้าไม่พบข้อมูลส่งสถานะ 404
        } else {
            res.status(200).json(orders); // ส่งข้อมูลกลับไปยัง client
        }
    } catch (err) {
        res.status(500).json(err); // ส่งสถานะ 500 เมื่อเกิดข้อผิดพลาด
    }
};

// ส่งออกฟังก์ชันเหล่านี้เพื่อให้ใช้งานในที่อื่นได้
module.exports = {
    createOrder,
    updateOrder,
    deleteOrder,
    getOrders,
    getOrderByID,
    getOrderByTerm,
};
