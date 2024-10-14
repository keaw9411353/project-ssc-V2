const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ฟังก์ชันสำหรับสร้างข้อมูลทางการเงิน
const createFinancial = async (req, res) => {
    const { FinancialID, Amount, Description, Date } = req.body; // ดึงข้อมูลจาก body ของ request
    try {
        const financial = await prisma.financial.create({  // ใช้คำสั่งสร้างข้อมูลในตาราง financial
            data: {
                FinancialID,
                Amount,
                Description,
                Date,
            },
        });
        res.status(200).json(financial); // ส่งสถานะ 200 และข้อมูลของการเงินที่สร้างใหม่กลับไปยัง client
    } catch (err) {
        res.status(500).json(err); // ส่งสถานะ 500 เมื่อเกิดข้อผิดพลาด
    }
};

// ฟังก์ชันสำหรับการอัปเดตข้อมูลทางการเงิน
const updateFinancial = async (req, res) => {
    const { FinancialID, Amount, Description, Date } = req.body; // ดึงข้อมูลจาก body ของ request

    try {
        const financial = await prisma.financial.update({  // อัปเดตข้อมูลในตาราง financial
            data: {
                Amount,
                Description,
                Date,
            },
            where: { FinancialID: Number(FinancialID) },  // ค้นหาข้อมูลตาม FinancialID
        });

        res.status(200).json(financial);  // ส่งข้อมูลที่อัปเดตกลับไปยัง client
    } catch (err) {
        res.status(500).json({ error: err.message }); // ส่งข้อผิดพลาดเมื่อเกิดข้อผิดพลาด
    }
};

// ฟังก์ชันสำหรับลบข้อมูลทางการเงิน
const deleteFinancial = async (req, res) => {
    const FinancialID = req.params.FinancialID; // รับค่า FinancialID จาก URL
    try {
        const financialExists = await prisma.financial.findUnique({
            where: { FinancialID: Number(FinancialID) },  // ตรวจสอบว่าข้อมูลที่ต้องการลบมีอยู่หรือไม่
        });

        if (!financialExists) {
            return res.status(404).json({ error: 'Financial record not found' });  // ถ้าไม่มีข้อมูลส่งสถานะ 404
        }

        const deletedFinancial = await prisma.financial.delete({
            where: { FinancialID: Number(FinancialID) }, // ลบข้อมูลตาม FinancialID
        });

        res.status(200).json({ message: 'Financial record deleted successfully', deletedFinancial }); // ส่งข้อมูลการลบสำเร็จกลับไปยัง client
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete financial record', details: err }); // ส่งสถานะ 500 เมื่อเกิดข้อผิดพลาด
    }
};

// ฟังก์ชันสำหรับดึงข้อมูลทางการเงินทั้งหมด
const getFinancials = async (req, res) => {
    const financials = await prisma.financial.findMany(); // ดึงข้อมูลทั้งหมดจากตาราง financial
    res.json(financials); // ส่งข้อมูลทางการเงินทั้งหมดกลับไปยัง client
};

// ฟังก์ชันสำหรับดึงข้อมูลทางการเงินตาม ID
const getFinancialById = async (req, res) => {
    const FinancialID = req.params.FinancialID; // รับค่า FinancialID จาก URL
    try {
        const financial = await prisma.financial.findUnique({
            where: { FinancialID: Number(FinancialID) }, // ค้นหาข้อมูลตาม FinancialID
        });
        if (!financial) {
            return res.status(404).json({ message: 'Financial record not found' }); // ถ้าไม่พบข้อมูลส่งสถานะ 404
        } else {
            res.status(200).json(financial); // ส่งข้อมูลกลับไปยัง client
        }
    } catch (err) {
        res.status(500).json(err); // ส่งสถานะ 500 เมื่อเกิดข้อผิดพลาด
    }
};

// ฟังก์ชันสำหรับค้นหาข้อมูลทางการเงินตามคำค้น (term)
const getFinancialsByTerm = async (req, res) => {
    const searchString = req.params.term; // รับคำค้นจาก URL
    try {
        const financials = await prisma.financial.findMany({
            where: {
                OR: [
                    {
                        Description: {
                            contains: searchString, // ค้นหาข้อมูลที่มีคำค้นใน Description
                        },
                    },
                ],
            },
        });
        if (!financials || financials.length === 0) {
            res.status(404).json({ message: 'Financial records not found!' }); // ถ้าไม่พบข้อมูลส่งสถานะ 404
        } else {
            res.status(200).json(financials); // ส่งข้อมูลกลับไปยัง client
        }
    } catch (err) {
        res.status(500).json(err);  // ส่งสถานะ 500 เมื่อเกิดข้อผิดพลาด
    }
};

// ส่งออกฟังก์ชันเหล่านี้เพื่อให้ใช้งาน

module.exports = {
    createFinancial,
    updateFinancial,
    deleteFinancial,
    getFinancials,
    getFinancialById,
    getFinancialsByTerm,
};
