const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ฟังก์ชันสำหรับการสร้างข้อมูล customer service ใหม่
const createCustomerService = async (req, res) => {
    const { TicketID, UsID, IssueDescription, Status, CreateAt } = req.body; // ดึงข้อมูลจาก body ของ request
    try {
        const service = await prisma.customerservice.create({  // ใช้คำสั่งสร้างข้อมูลในตาราง customerservice
            data: {
                TicketID,
                UsID,
                IssueDescription,
                Status,
                CreateAt,
            }
        });
        res.status(200).json(service); // ส่งข้อมูลของ service ที่สร้างใหม่กลับไปยัง client
    } catch (err) {
        res.status(500).json(err); // ส่งสถานะ 500 เมื่อเกิดข้อผิดพลาด
    }
};

// ฟังก์ชันสำหรับการอัปเดตข้อมูล customer service
const updateCustomerService = async (req, res) => {  
    const { TicketID, UsID, IssueDescription, Status, CreateAt } = req.body; // ดึงข้อมูลจาก body ของ request

    try {
        const service = await prisma.customerservice.update({  // อัปเดตข้อมูลในตาราง customerservice
            data: {
                TicketID,
                UsID,
                IssueDescription,
                Status,
                CreateAt,
            },
            where: { ID: Number(req.params.ID) }  // ค้นหาข้อมูลตาม ID
        });

        res.status(200).json(service);  // ส่งข้อมูลที่อัปเดตกลับไปยัง client
    } catch (err) {
        res.status(500).json({ error: err.message }); // ส่งข้อผิดพลาดเมื่อเกิดข้อผิดพลาด
    }
};

// ฟังก์ชันสำหรับลบข้อมูล customer service
const deleteCustomerService = async (req, res) => {
    const ID = req.params.ID; // รับค่า ID จาก URL
    try {
        const serviceExists = await prisma.customerservice.findUnique({
            where: { ID: Number(ID) },  // ตรวจสอบว่าข้อมูลที่ต้องการลบมีอยู่หรือไม่
        });

        if (!serviceExists) {
            return res.status(404).json({ error: 'Customer Service record not found' });  // ถ้าไม่มีข้อมูลส่งสถานะ 404
        }

        const deletedService = await prisma.customerservice.delete({
            where: { ID: Number(ID) }, // ลบข้อมูลตาม ID
        });

        res.status(200).json({ message: 'Customer Service record deleted successfully', deletedService }); // ส่งข้อมูลการลบสำเร็จกลับไปยัง client
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete customer service', details: err }); // ส่งสถานะ 500 เมื่อเกิดข้อผิดพลาด
    }
};

// ฟังก์ชันสำหรับดึงข้อมูล customer service ทั้งหมด
const getCustomerServices = async (req, res) => {
    try {
        const services = await prisma.customerservice.findMany(); // ดึงข้อมูลทั้งหมดจากตาราง customerservice
        res.json(services); // ส่งข้อมูลกลับไปยัง client
    } catch (err) {
        res.status(500).json({ error: err.message }); // ส่งข้อผิดพลาดเมื่อเกิดข้อผิดพลาด
    }
};

// ฟังก์ชันสำหรับดึงข้อมูล customer service ตาม ID
const getCustomerServiceByID = async (req, res) => {
    const ID = req.params.ID; // รับค่า ID จาก URL
    try {
        const service = await prisma.customerservice.findUnique({
            where: { ID: Number(ID) }, // ค้นหาข้อมูลตาม ID
        });
        if (!service) {
            return res.status(404).json({ message: 'Customer Service record not found' }); // ถ้าไม่พบข้อมูลส่งสถานะ 404
        } else {
            res.status(200).json(service); // ส่งข้อมูลกลับไปยัง client
        }
    } catch (err) {
        res.status(500).json(err); // ส่งสถานะ 500 เมื่อเกิดข้อผิดพลาด
    }
};

// ฟังก์ชันสำหรับค้นหาข้อมูล customer service ตามคำค้น (term)
const getCustomerServiceByTerm = async (req, res) => { // รับคำค้นจาก URL
    const searchString = req.params.term;
    try {
        const services = await prisma.customerservice.findMany({
            where: {
                OR: [
                    {
                        CustomerName: {
                            contains: searchString // ค้นหาข้อมูลที่มี CustomerName ตรงกับคำค้น
                        }
                    },
                    {
                        IssueDescription: {
                            contains: searchString // ค้นหาข้อมูลที่มี IssueDescription ตรงกับคำค้น
                        }
                    }
                ]
            },
        });
        if (!services || services.length === 0) {
            res.status(404).json({ message: 'No Customer Service records found!' }); // ถ้าไม่พบข้อมูลส่งสถานะ 404
        } else {
            res.status(200).json(services); // ส่งข้อมูลกลับไปยัง client
        }
    } catch (err) {
        res.status(500).json(err);  // ส่งสถานะ 500 เมื่อเกิดข้อผิดพลาด
    }
};

// ส่งออกฟังก์ชันเหล่านี้เพื่อให้ใช้งานในที่อื่นได้
module.exports = {
    createCustomerService,
    updateCustomerService,
    deleteCustomerService,
    getCustomerServices,
    getCustomerServiceByID,
    getCustomerServiceByTerm,
};
