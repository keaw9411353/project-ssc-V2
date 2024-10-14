const express = require('express');
const router = express.Router();

const  userController = require("../Controllers_V2/user");
const  CustomerController = require("../Controllers_V2/customer");
const  ProjectController = require("../Controllers_V2/project");
const  categoriesController = require("../Controllers_V2/categories");
const  productsController = require("../Controllers_V2/products");
const  ordersController = require('../Controllers_V2/orders');
const  orderDetailsController = require('../Controllers_V2/orderdetails');
const  paymentsController = require('../Controllers_V2/payments');

//zone users
router.post('/user',userController.createUser);


//zone customer
router.get('/customers', CustomerController.getAllCustomers);
router.get('/customers/:customerId', CustomerController.getCustomerById);
router.put('/customers/:customerId', CustomerController.updateCustomer);
router.delete('/customers/:customerId', CustomerController.deleteCustomer);

//zone project
router.post('/projects', ProjectController.createProject);
router.get('/projects', ProjectController.getAllProjects);
router.get('/projects/:projectId', ProjectController.getProjectById);
router.put('/projects/:projectId', ProjectController.updateProject);
router.delete('/projects/:projectId', ProjectController.deleteProject);

// Zone categories
router.get('/categories', categoriesController.getAllCategories);
router.get('/categories/:categoryId', categoriesController.getCategoryById);
router.put('/categories/:categoryId', categoriesController.updateCategory);
router.delete('/categories/:categoryId', categoriesController.deleteCategory);
router.post('/categories', categoriesController.createCategory);// เพิ่มเส้นทางสำหรับการสร้างหมวดหมู่


// Zone Products
router.post('/products', productsController.createProduct);
router.get('/products', productsController.getAllProducts); // ดึงข้อมูลสินค้าทั้งหมด
router.get('/products/:productId', productsController.getProductById); // ดึงข้อมูลสินค้าตาม ID
router.put('/products/:productId', productsController.updateProduct); // อัปเดตสินค้าตาม ID
router.delete('/products/:productId', productsController.deleteProduct); // ลบสินค้าตาม ID


//Zone Oders
router.post('/orders', ordersController.createOrder);
router.get('/orders', ordersController.getAllOrders);
router.get('/orders/:orderId', ordersController.getOrderById);
router.put('/orders/:orderId', ordersController.updateOrder);
router.delete('/orders/:orderId', ordersController.deleteOrder);


//Zone Oderdetail
router.post('/orderdetails', orderDetailsController.createOrderDetail);  // Create a new order detail
router.get('/orderdetails', orderDetailsController.getAllOrderDetails);  // Get all order details
router.get('/orderdetails/:orderDetailsId', orderDetailsController.getOrderDetailById);  // Get a single order detail by ID
router.put('/orderdetails/:orderDetailsId', orderDetailsController.updateOrderDetail);  // Update an order detail
router.delete('/orderdetails/:orderDetailId', orderDetailsController.deleteOrderDetail);




//Zone Payments
router.post('/payments', paymentsController.createPayment);
router.get('/payments', paymentsController.getAllPayments);
router.get('/payments/:paymentId', paymentsController.getPaymentById);
router.put('/payments/:paymentId', paymentsController.updatePayment);
router.delete('/payments/:paymentId', paymentsController.deletePayment);


module.exports = router;