const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ฟังก์ชันสำหรับการสร้างข้อมูล orderdetails ใหม่
const createOrderDetails = async (req, res) => {
    const { OrdersDetailID, OrderssID,  ProducttID, Quantity, UnitPrice, orders, products } = req.body; // ดึงข้อมูลจาก body ของ request
    try {
        const orderDetail = await prisma.orderdetails.create({
            data: {
                OrdersDetailID,
                OrderssID,      
                ProducttID,     
                Quantity,      
                UnitPrice,      
                orders,         
                products, 
            },
        });
        res.status(200).json(orderDetail); // ส่งข้อมูลของ orderDetail ที่สร้างใหม่กลับไปยัง client
    } catch (err) {
        res.status(500).json(err); // ส่งสถานะ 500 เมื่อเกิดข้อผิดพลาด
    }
};

// ฟังก์ชันสำหรับการอัปเดตข้อมูล orderdetails
const updateOrderDetails = async (req, res) => {
    const { OrdersDetailID, OrderssID,  ProducttID, Quantity, UnitPrice, orders, products } = req.body; // ดึงข้อมูลจาก body ของ request
    try {
        const orderDetail = await prisma.orderdetails.update({
            data: {
                OrdersDetailID,
                OrderssID,      
                ProducttID,     
                Quantity,      
                UnitPrice,      
                orders,         
                products, 
            },
            where: { ID: Number(req.params.ID) } // ค้นหาข้อมูลตาม ID
        });

        res.status(200).json(orderDetail); // ส่งข้อมูลที่อัปเดตกลับไปยัง client
    } catch (err) {
        res.status(500).json({ error: err.message }); // ส่งข้อผิดพลาดเมื่อเกิดข้อผิดพลาด
    }
};

// ฟังก์ชันสำหรับลบข้อมูล orderdetails
const deleteOrderDetails = async (req, res) => {
    const ID = req.params.ID; // รับค่า ID จาก URL
    try {
        const orderDetailExists = await prisma.orderdetails.findUnique({
            where: { ID: Number(ID) }, // ตรวจสอบว่าข้อมูลที่ต้องการลบมีอยู่หรือไม่
        });

        if (!orderDetailExists) {
            return res.status(404).json({ error: 'Order detail not found' }); // ถ้าไม่มีข้อมูลส่งสถานะ 404
        }

        const deletedOrderDetail = await prisma.orderdetails.delete({
            where: { ID: Number(ID) }, // ลบข้อมูลตาม ID
        });

        res.status(200).json({ message: 'Order detail deleted successfully', deletedOrderDetail }); // ส่งข้อมูลการลบสำเร็จกลับไปยัง client
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete order detail', details: err }); // ส่งสถานะ 500 เมื่อเกิดข้อผิดพลาด
    }
};

// ฟังก์ชันสำหรับดึงข้อมูล orderdetails ทั้งหมด
const getOrderDetails = async (req, res) => {
    try {
        const orderDetails = await prisma.orderdetails.findMany(); // ดึงข้อมูลทั้งหมดจากตาราง orderdetails
        res.json(orderDetails); // ส่งข้อมูลกลับไปยัง client
    } catch (err) {
        res.status(500).json({ error: err.message }); // ส่งข้อผิดพลาดเมื่อเกิดข้อผิดพลาด
    }
};

// ฟังก์ชันสำหรับดึงข้อมูล orderdetails ตาม ID
const getOrderDetailsByID = async (req, res) => {
    const ID = req.params.ID; // รับค่า ID จาก URL
    try {
        const orderDetail = await prisma.orderdetails.findUnique({
            where: { ID: Number(ID) }, // ค้นหาข้อมูลตาม ID
        });
        if (!orderDetail) {
            return res.status(404).json({ message: 'Order detail not found' }); // ถ้าไม่พบข้อมูลส่งสถานะ 404
        } else {
            res.status(200).json(orderDetail); // ส่งข้อมูลกลับไปยัง client
        }
    } catch (err) {
        res.status(500).json(err); // ส่งสถานะ 500 เมื่อเกิดข้อผิดพลาด
    }
};

// ฟังก์ชันสำหรับค้นหาข้อมูล orderdetails ตามคำค้น (term)
const getOrderDetailsByTerm = async (req, res) => {
    const searchString = req.params.term; // รับคำค้นจาก URL
    try {
        const orderDetails = await prisma.orderdetails.findMany({
            where: {
                OR: [
                    {
                        ProductName: {
                            contains: searchString // ค้นหาข้อมูลที่มี ProductName ตรงกับคำค้น
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
        if (!orderDetails || orderDetails.length === 0) {
            res.status(404).json({ message: 'No order details found!' }); // ถ้าไม่พบข้อมูลส่งสถานะ 404
        } else {
            res.status(200).json(orderDetails); // ส่งข้อมูลกลับไปยัง client
        }
    } catch (err) {
        res.status(500).json(err); // ส่งสถานะ 500 เมื่อเกิดข้อผิดพลาด
    }
};

// ส่งออกฟังก์ชันเหล่านี้เพื่อให้ใช้งานในที่อื่นได้
module.exports = {
    createOrderDetails,
    updateOrderDetails,
    deleteOrderDetails,
    getOrderDetails,
    getOrderDetailsByID,
    getOrderDetailsByTerm,
}; 