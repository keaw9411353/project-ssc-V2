const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ฟังก์ชันสำหรับการสร้างข้อมูล products ใหม่
const createProduct = async (req, res) => {
    const { ProductsID, ProductsName, CategoryID, Price, Description, ImageURL, StockQuantity, CreatedAt, 
           UpdatedAt, orderdetails, user, reviews } = req.body; // ดึงข้อมูลจาก body ของ request
    try {
        const product = await prisma.products.create({
            data: {
                ProductsID,   
                ProductsName,  
                CategoryID,   
                Price,         
                Description,   
                ImageURL,      
                StockQuantity, 
                CreatedAt,     
                UpdatedAt,     
                orderdetails,  
                user,          
                reviews, 
            },
        });
        res.status(200).json(product); // ส่งข้อมูลของ product ที่สร้างใหม่กลับไปยัง client
    } catch (err) {
        res.status(500).json(err); // ส่งสถานะ 500 เมื่อเกิดข้อผิดพลาด
    }
};

// ฟังก์ชันสำหรับการอัปเดตข้อมูล products
const updateProduct = async (req, res) => {
    const { ProductsID, ProductsName, CategoryID, Price, Description, ImageURL, StockQuantity, CreatedAt, 
           UpdatedAt, orderdetails, user, reviews } = req.body; // ดึงข้อมูลจาก body ของ request
    try {
        const product = await prisma.products.update({
            data: {
                ProductsID,   
                ProductsName,  
                CategoryID,   
                Price,         
                Description,   
                ImageURL,      
                StockQuantity, 
                CreatedAt,     
                UpdatedAt,     
                orderdetails,  
                user,          
                reviews,
            },
            where: { ID: Number(req.params.ID) } // ค้นหาข้อมูลตาม ID
        });

        res.status(200).json(product); // ส่งข้อมูลที่อัปเดตกลับไปยัง client
    } catch (err) {
        res.status(500).json({ error: err.message }); // ส่งข้อผิดพลาดเมื่อเกิดข้อผิดพลาด
    }
};

// ฟังก์ชันสำหรับลบข้อมูล products
const deleteProduct = async (req, res) => {
    const ID = req.params.ID; // รับค่า ID จาก URL
    try {
        const productExists = await prisma.products.findUnique({
            where: { ID: Number(ID) }, // ตรวจสอบว่าข้อมูลที่ต้องการลบมีอยู่หรือไม่
        });

        if (!productExists) {
            return res.status(404).json({ error: 'Product not found' }); // ถ้าไม่มีข้อมูลส่งสถานะ 404
        }

        const deletedProduct = await prisma.products.delete({
            where: { ID: Number(ID) }, // ลบข้อมูลตาม ID
        });

        res.status(200).json({ message: 'Product deleted successfully', deletedProduct }); // ส่งข้อมูลการลบสำเร็จกลับไปยัง client
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete product', details: err }); // ส่งสถานะ 500 เมื่อเกิดข้อผิดพลาด
    }
};

// ฟังก์ชันสำหรับดึงข้อมูล products ทั้งหมด
const getProducts = async (req, res) => {
    try {
        const products = await prisma.products.findMany(); // ดึงข้อมูลทั้งหมดจากตาราง products
        res.json(products); // ส่งข้อมูลกลับไปยัง client
    } catch (err) {
        res.status(500).json({ error: err.message }); // ส่งข้อผิดพลาดเมื่อเกิดข้อผิดพลาด
    }
};

// ฟังก์ชันสำหรับดึงข้อมูล products ตาม ID
const getProductByID = async (req, res) => {
    const ID = req.params.ID; // รับค่า ID จาก URL
    try {
        const product = await prisma.products.findUnique({
            where: { ID: Number(ID) }, // ค้นหาข้อมูลตาม ID
        });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' }); // ถ้าไม่พบข้อมูลส่งสถานะ 404
        } else {
            res.status(200).json(product); // ส่งข้อมูลกลับไปยัง client
        }
    } catch (err) {
        res.status(500).json(err); // ส่งสถานะ 500 เมื่อเกิดข้อผิดพลาด
    }
};

// ฟังก์ชันสำหรับค้นหาข้อมูล products ตามคำค้น (term)
const getProductByTerm = async (req, res) => {
    const searchString = req.params.term; // รับคำค้นจาก URL
    try {
        const products = await prisma.products.findMany({
            where: {
                OR: [
                    {
                        ProductName: {
                            contains: searchString // ค้นหาข้อมูลที่มี ProductName ตรงกับคำค้น
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
        if (!products || products.length === 0) {
            res.status(404).json({ message: 'No products found!' }); // ถ้าไม่พบข้อมูลส่งสถานะ 404
        } else {
            res.status(200).json(products); // ส่งข้อมูลกลับไปยัง client
        }
    } catch (err) {
        res.status(500).json(err); // ส่งสถานะ 500 เมื่อเกิดข้อผิดพลาด
    }
};

// ส่งออกฟังก์ชันเหล่านี้เพื่อให้ใช้งานในที่อื่นได้
module.exports = {
    createProduct,
    updateProduct,
    deleteProduct,
    getProducts,
    getProductByID,
    getProductByTerm,
};