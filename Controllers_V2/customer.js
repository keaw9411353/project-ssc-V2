const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all customers
const getAllCustomers = async (req, res) => {
    try {
        const customers = await prisma.customers.findMany();
        res.status(200).json(customers);
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch customers',
            error
        });
    }
};

// Get a single customer by ID
const getCustomerById = async (req, res) => {
    const { customerId } = req.params;

    try {
        const customer = await prisma.customers.findUnique({
            where: {
                Customer_ID: parseInt(customerId, 10)
            }
        });

        if (!customer) {
            return res.status(404).json({ 
                status: 'error',
                message: 'Customer not found' 
            });
        }

        res.status(200).json(customer);
    } catch (error) {
        console.error('Error fetching customer:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch customer',
            error
        });
    }
};

// Update a customer
const updateCustomer = async (req, res) => {
    const { customerId } = req.params;
    const { Customer_name, Status, email, UserID } = req.body;

    const data = {};
    if (Customer_name) data.Customer_name = Customer_name;
    if (Status) data.Status = Status;
    if (email) data.email = email;
    if (UserID) data.UserID = UserID;

    if (Object.keys(data).length === 0) {
        return res.status(400).json({ 
            status: 'error',
            message: 'No data provided for update' 
        });
    }

    try {
        const updatedCustomer = await prisma.customers.update({
            where: { Customer_ID: parseInt(customerId, 10) },
            data
        });

        res.status(200).json({
            status: 'ok',
            message: `Customer with ID = ${customerId} is updated`,
            updatedCustomer
        });
    } catch (err) {
        if (err.code === 'P2025') {
            res.status(404).json({ 
                status: 'error',
                message: `Customer with ID = ${customerId} not found` 
            });
        } else {
            console.error('Update customer error:', err);
            res.status(500).json({
                status: 'error',
                message: 'An unexpected error occurred'
            });
        }
    }
};

// Delete a customer
const deleteCustomer = async (req, res) => {
    const { customerId } = req.params;

    try {
        const deletedCustomer = await prisma.customers.delete({
            where: { Customer_ID: parseInt(customerId, 10) }
        });

        res.status(200).json({
            status: 'ok',
            message: `Customer with ID = ${customerId} is deleted`,
            deletedCustomer
        });
    } catch (err) {
        if (err.code === 'P2025') {
            res.status(404).json({ 
                status: 'error',
                message: `Customer with ID = ${customerId} not found` 
            });
        } else {
            console.error('Delete customer error:', err);
            res.status(500).json({
                status: 'error',
                message: 'An unexpected error occurred'
            });
        }
    }
};

module.exports = {  getAllCustomers, getCustomerById, updateCustomer, deleteCustomer };
