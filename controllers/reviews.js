const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ฟังก์ชันสำหรับการสร้างข้อมูล reviews ใหม่
const createReview = async (req, res) => {
    const { ReviewID, ProductID, UserID, Comment, CreatedAt, Rating, products, user } = req.body; // ดึงข้อมูลจาก body ของ request
    try {
        const review = await prisma.reviews.create({
            data: {
                ReviewID,  
                ProductID,
                UserID,    
                Comment,   
                CreatedAt, 
                Rating,    
                products,  
                user,  
            },
        });
        res.status(200).json(review); // ส่งข้อมูลของ review ที่สร้างใหม่กลับไปยัง client
    } catch (err) {
        res.status(500).json(err); // ส่งสถานะ 500 เมื่อเกิดข้อผิดพลาด
    }
};

// ฟังก์ชันสำหรับการอัปเดตข้อมูล reviews
const updateReview = async (req, res) => {
    const {  ReviewID, ProductID, UserID, Comment, CreatedAt, Rating, products, user } = req.body; // ดึงข้อมูลจาก body ของ request
    try {
        const review = await prisma.reviews.update({
            data: {
                ReviewID,  
                ProductID,
                UserID,    
                Comment,   
                CreatedAt, 
                Rating,    
                products,  
                user,   
            },
            where: { ID: Number(req.params.ID) } // ค้นหาข้อมูลตาม ID
        });

        res.status(200).json(review); // ส่งข้อมูลที่อัปเดตกลับไปยัง client
    } catch (err) {
        res.status(500).json({ error: err.message }); // ส่งข้อผิดพลาดเมื่อเกิดข้อผิดพลาด
    }
};

// ฟังก์ชันสำหรับลบข้อมูล reviews
const deleteReview = async (req, res) => {
    const ID = req.params.ID; // รับค่า ID จาก URL
    try {
        const reviewExists = await prisma.reviews.findUnique({
            where: { ID: Number(ID) }, // ตรวจสอบว่าข้อมูลที่ต้องการลบมีอยู่หรือไม่
        });

        if (!reviewExists) {
            return res.status(404).json({ error: 'Review not found' }); // ถ้าไม่มีข้อมูลส่งสถานะ 404
        }

        const deletedReview = await prisma.reviews.delete({
            where: { ID: Number(ID) }, // ลบข้อมูลตาม ID
        });

        res.status(200).json({ message: 'Review deleted successfully', deletedReview }); // ส่งข้อมูลการลบสำเร็จกลับไปยัง client
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete review', details: err }); // ส่งสถานะ 500 เมื่อเกิดข้อผิดพลาด
    }
};

// ฟังก์ชันสำหรับดึงข้อมูล reviews ทั้งหมด
const getReviews = async (req, res) => {
    try {
        const reviews = await prisma.reviews.findMany(); // ดึงข้อมูลทั้งหมดจากตาราง reviews
        res.json(reviews); // ส่งข้อมูลกลับไปยัง client
    } catch (err) {
        res.status(500).json({ error: err.message }); // ส่งข้อผิดพลาดเมื่อเกิดข้อผิดพลาด
    }
};

// ฟังก์ชันสำหรับดึงข้อมูล reviews ตาม ID
const getReviewByID = async (req, res) => {
    const ID = req.params.ID; // รับค่า ID จาก URL
    try {
        const review = await prisma.reviews.findUnique({
            where: { ID: Number(ID) }, // ค้นหาข้อมูลตาม ID
        });
        if (!review) {
            return res.status(404).json({ message: 'Review not found' }); // ถ้าไม่พบข้อมูลส่งสถานะ 404
        } else {
            res.status(200).json(review); // ส่งข้อมูลกลับไปยัง client
        }
    } catch (err) {
        res.status(500).json(err); // ส่งสถานะ 500 เมื่อเกิดข้อผิดพลาด
    }
};

// ฟังก์ชันสำหรับค้นหาข้อมูล reviews ตามคำค้น (term)
const getReviewByTerm = async (req, res) => {
    const searchString = req.params.term; // รับคำค้นจาก URL
    try {
        const reviews = await prisma.reviews.findMany({
            where: {
                OR: [
                    {
                        Comment: {
                            contains: searchString // ค้นหาข้อมูลที่มี Comment ตรงกับคำค้น
                        }
                    },
                    {
                        ProductID: {
                            contains: searchString // ค้นหาข้อมูลที่มี ProductID ตรงกับคำค้น
                        }
                    }
                ]
            },
        });
        if (!reviews || reviews.length === 0) {
            res.status(404).json({ message: 'No reviews found!' }); // ถ้าไม่พบข้อมูลส่งสถานะ 404
        } else {
            res.status(200).json(reviews); // ส่งข้อมูลกลับไปยัง client
        }
    } catch (err) {
        res.status(500).json(err); // ส่งสถานะ 500 เมื่อเกิดข้อผิดพลาด
    }
};

// ส่งออกฟังก์ชันเหล่านี้เพื่อให้ใช้งานในที่อื่นได้
module.exports = {
    createReview,
    updateReview,
    deleteReview,
    getReviews,
    getReviewByID,
    getReviewByTerm,
};

 