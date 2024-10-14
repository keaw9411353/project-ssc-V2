const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ฟังก์ชันสำหรับการสร้างข้อมูล category ใหม่
const createcategories = async (req, res) => {
    const { CategoriesID, CategoriesName } = req.body;
    try {
        const categories= await prisma.categories.create({
            data: {
                CategoriesID,
                CategoriesName,
            }
        });
        res.status(200).json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ฟังก์ชันสำหรับการอัปเดตข้อมูล category
const updatecategories = async (req, res) => {
    const { CategoriesID, CategoriesName } = req.body;
    const id = Number(req.params.id); // รับ ID จาก URL
    try {
        const categories = await prisma.categories.update({
            data: {
                CategoriesID,
                CategoriesName,
            },
            where: {CategoriesID: id }
        });
        res.status(200).json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ฟังก์ชันสำหรับลบข้อมูล category
const deletecategories = async (req, res) => {
    const id = Number(req.params.id);
    try {
        const categoriesExists = await prisma.categories.findUnique({
            where: { CategoriesID: id },
        });

        if (!categoriesExists) {
            return res.status(404).json({ error: 'categories record not found' });
        }

        const deletedcategories = await prisma.categories.delete({
            where: { CategoriesID: id },
        });

        res.status(200).json({ message: 'categories record deleted successfully', deletedcategories });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete categories', details: err.message });
    }
};

// ฟังก์ชันสำหรับดึงข้อมูล category ทั้งหมด
const getcategories = async (req, res) => {
    try {
        const categories = await prisma.categories.findMany();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ฟังก์ชันสำหรับดึงข้อมูลcategoriesตาม ID
const getcategoriesByID = async (req, res) => {
    const id = Number(req.params.id);
    try {
        const categories = await prisma.categories.findUnique({
            where: { ID: id },
        });
        if (!categories) {
            return res.status(404).json({ message: 'Category record not found' });
        } else {
            res.status(200).json(categories);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ฟังก์ชันสำหรับค้นหาข้อมูล category ตามคำค้น (term)
const getcategoriesByTerm = async (req, res) => {
    const searchString = req.params.term;
    try {
        const categories = await prisma.categories.findMany({
            where: {
                CategoriesName: {
                    contains: searchString,
                },
            },
        });
        if (!categories || categories.length === 0) {
            res.status(404).json({ message: 'No Category records found!' });
        } else {
            res.status(200).json(categories);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createcategories,
    updatecategories,
    deletecategories,
    getcategories,
    getcategoriesByID,
    getcategoriesByTerm,
};
