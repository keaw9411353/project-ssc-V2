const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const createUser = async (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    // Log the incoming request for debugging purposes
    console.log('Creating user with:', { username, password });

    try {
        // Hash the password with salt rounds set to 10
        const hashResult = await bcrypt.hash(password, 10); // Ensure that password and salt rounds are provided correctly

        // Store the user data
        const userData = {
            Username: username, // Ensure this matches the schema
            Password: hashResult,
            customers: {
                create: {
                    Status: 'setvalue',
                    Customer_name: 'setvalue',
                    email: 'setvalue'
                }
              }
        };

        const user = await prisma.users.create({
            data: userData
        });

        res.status(200).json({ message: 'User created successfully', user });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            message: 'Failed to create user.',
            error: error.message,
        });
    }
};

module.exports = { createUser };
