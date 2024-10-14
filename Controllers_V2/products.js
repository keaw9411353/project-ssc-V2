const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new product
const createProduct = async (req, res) => {
    const { ProductsName, CategoryID, Description, Price, ImageURL, status } = req.body;

    try {
        const newProduct = await prisma.products.create({
            data: {
                ProductsName,
                CategoryID,
                Description,
                Price,
                ImageURL,
                status
            }
        });
        res.status(201).json({
            status: 'ok',
            message: 'Product created successfully',
            newProduct
        });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to create product',
            error
        });
    }
};

// Get all products
const getAllProducts = async (req, res) => {
    try {
        const products = await prisma.products.findMany();
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch products',
            error
        });
    }
};

// Get a single product by ID
const getProductById = async (req, res) => {
    const { productId } = req.params;

    try {
        const product = await prisma.products.findUnique({
            where: {
                Products_id: parseInt(productId, 10)
            }
        });

        if (!product) {
            return res.status(404).json({ 
                status: 'error',
                message: 'Product not found' 
            });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch product',
            error
        });
    }
};

// Update a product
const updateProduct = async (req, res) => {
    const { productId } = req.params;
    const { ProductsName, CategoryID, Description, Price, ImageURL, status } = req.body;

    const data = {};
    if (ProductsName) data.ProductsName = ProductsName;
    if (CategoryID) data.CategoryID = CategoryID;
    if (Description) data.Description = Description;
    if (Price) data.Price = Price;
    if (ImageURL) data.ImageURL = ImageURL;
    if (status) data.status = status;

    if (Object.keys(data).length === 0) {
        return res.status(400).json({ 
            status: 'error',
            message: 'No data provided for update' 
        });
    }

    try {
        const updatedProduct = await prisma.products.update({
            where: { Products_id: parseInt(productId, 10) },
            data
        });

        res.status(200).json({
            status: 'ok',
            message: `Product with ID = ${productId} is updated`,
            updatedProduct
        });
    } catch (err) {
        if (err.code === 'P2025') {
            res.status(404).json({ 
                status: 'error',
                message: `Product with ID = ${productId} not found` 
            });
        } else {
            console.error('Update product error:', err);
            res.status(500).json({
                status: 'error',
                message: 'An unexpected error occurred'
            });
        }
    }
};

// Delete a product
const deleteProduct = async (req, res) => {
    const { productId } = req.params;

    try {
        const deletedProduct = await prisma.products.delete({
            where: { Products_id: parseInt(productId, 10) }
        });

        res.status(200).json({
            status: 'ok',
            message: `Product with ID = ${productId} is deleted`,
            deletedProduct
        });
    } catch (err) {
        if (err.code === 'P2025') {
            res.status(404).json({ 
                status: 'error',
                message: `Product with ID = ${productId} not found` 
            });
        } else {
            console.error('Delete product error:', err);
            res.status(500).json({
                status: 'error',
                message: 'An unexpected error occurred'
            });
        }
    }
};

module.exports = { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct };
