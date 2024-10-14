const express = require('express');
const routers = express.Router();
const categoriesController = require('../controllers/categories');

// POST: สร้างข้อมูล categories ใหม่
routers.post('/categories', categoriesController.createcategories);

// PUT: อัปเดตข้อมูล categories (ควรใช้ :id ใน URL เพื่อบอก ID ที่จะอัปเดต)
routers.put('/categories/:id', categoriesController.updatecategories);

// DELETE: ลบข้อมูล categories โดยใช้ ID
routers.delete('/categories/:id', categoriesController.deletecategories);

// GET: ดึงข้อมูล categories ตาม ID
routers.get('/categories/:id', categoriesController.getcategoriesByID);

// GET: ค้นหาข้อมูล categories โดยใช้คำค้น (term)
routers.get('/q/:term', categoriesController.getcategoriesByTerm);

// GET: ดึงข้อมูล categories ทั้งหมด
routers.get('/categories', categoriesController.getcategories);

module.exports = routers;
