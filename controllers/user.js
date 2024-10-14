const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

const createUser = async (req, res) => {
    const { UserID,Username,PasswordHash,Email,CreateAt } = req.body; // ดึงข้อมูลจาก body ของ request
    try {
        const cust = await prisma.user.create({  // ใช้คำสั่งสร้างข้อมูลผู้ใช้ในตาราง user
            data: {
                UserID,
                Username,
                PasswordHash,
                Email,
                CreateAt,
            }
        });
        res.status(200).json(cust); // ส่งสถานะ 200 และข้อมูลของผู้ใช้ที่สร้างใหม่กลับไปยัง client
    } catch (err) {
        res.status(500).json(err); // ส่งสถานะ 500 เมื่อเกิดข้อผิดพลาด
    }
};


// ฟังก์ชันสำหรับการอัปเดตข้อมูลผู้ใช้
const updateUser = async (req, res) => {  
    const { UserID,Username,PasswordHash,Email } = req.body; // ดึงข้อมูลจาก body ของ request

    try {
        const cust = await prisma.user.update({  // อัปเดตข้อมูลในตาราง user
            data: {
                UserID,
                Username,
                PasswordHash,
                Email,
                // ไม่รวม created_at ใน data เพราะว่าเวลาอัปเดตไม่ต้องการเปลี่ยนแปลงเวลา create
            },
            where: { ID: Number(ID) }  // ค้นหาข้อมูลตาม ID
        });

        res.status(200).json(cust);  // ส่งข้อมูลที่อัปเดตกลับไปยัง client
    } catch (err) {
        res.status(500).json({ error: err.message }); // ส่งข้อผิดพลาดเมื่อเกิดข้อผิดพลาด
    }
};

// ฟังก์ชันสำหรับลบข้อมูลผู้ใช้
const deleteUser = async (req, res) => {
    const ID = req.params.ID; // รับค่า ID จาก URL
    try {
        const userExists = await prisma.user.findUnique({
            where: { ID: Number(ID) },  // ตรวจสอบว่าผู้ใช้ที่ต้องการลบมีอยู่หรือไม่
        });

        if (!userExists) {
            return res.status(404).json({ error: 'User not found' });  // ถ้าไม่มีผู้ใช้ส่งสถานะ 404
        }

        const deletedUser = await prisma.user.delete({
            where: { ID: Number(ID) }, // ลบผู้ใช้ตาม ID
        });

        res.status(200).json({ message: 'User deleted successfully', deletedUser }); // ส่งข้อมูลการลบสำเร็จกลับไปยัง client
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete user', details: err }); // ส่งสถานะ 500 เมื่อเกิดข้อผิดพลาด
    }
};


       

// ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้ทั้งหมด
const getUser = async (req, res) => {
    const custs = await prisma.user.findMany(); // ดึงข้อมูลผู้ใช้ทั้งหมดจากตาราง user
    res.json(custs); // ส่งข้อมูลผู้ใช้ทั้งหมดกลับไปยัง client
};

// ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้ตาม ID
const getUsers = async (req, res) => {
    const ID = req.params.ID; // รับค่า ID จาก URL
    try {
        const cust = await prisma.user.findUnique({
            where: { ID: Number(ID) }, // ค้นหาผู้ใช้ตาม ID
        });
        if (!cust) {
            return res.status(404).json({ message: 'User not found' }); // ถ้าไม่พบผู้ใช้ส่งสถานะ 404
        } else {
            res.status(200).json(cust); // ส่งข้อมูลผู้ใช้กลับไปยัง client
        }
    } catch (err) {
        res.status(500).json(err); // ส่งสถานะ 500 เมื่อเกิดข้อผิดพลาด
    }
};
// ฟังก์ชันสำหรับค้นหาผู้ใช้ตามคำค้น (term)
const getUserByTerm = async (req, res) => { // รับคำค้นจาก URL
    const searchString = req.params.term;
    try {
        const custs = await prisma.user.findMany({
            where: {
                OR: [
                    {
                        Username: {
                            contains: searchString // ค้นหาผู้ใช้ที่มี Username ตรงกับคำค้น
                        }
                    },
                    {
                        Email: {
                            contains: searchString // ค้นหาผู้ใช้ที่มี Email ตรงกับคำค้น
                        }
                    }
                ]
            },
        });
        if (!custs || custs.length === 0) {
            res.status(404).json({ message: 'Customer not found!' }); // ถ้าไม่พบผู้ใช้ส่งสถานะ 404
        } else {
            res.status(200).json(custs); // ส่งข้อมูลผู้ใช้กลับไปยัง client
        }
    } catch (err) {
        res.status(500).json(err);  // ส่งสถานะ 500 เมื่อเกิดข้อผิดพลาด
    }
};

// ส่งออกฟังก์ชันเหล่านี้เพื่อให้ใช้งานในที่อื่นได้
module.exports = {

    createUser,
    updateUser,
    deleteUser,
    getUser,
    getUsers,
    getUserByTerm,
};      