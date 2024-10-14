const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new payment
const createPayment = async (req, res) => {
    const { OrderID, PaymentDate, Amount, PaymentMethod, remark, payment_status } = req.body;

    try {
        const newPayment = await prisma.payments.create({
            data: {
                OrderID,
                PaymentDate,
                Amount,
                PaymentMethod,
                remark,
                payment_status
            }
        });
        res.status(201).json({
            status: 'ok',
            message: 'Payment created successfully',
            newPayment
        });
    } catch (error) {
        console.error('Error creating payment:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to create payment',
            error
        });
    }
};

// Get All Payments (ดึงข้อมูลการชำระเงินทั้งหมด)
const getAllPayments = async (req, res) => {
    try {
        const payments = await prisma.payments.findMany({
            include: {
                orders: true // รวมข้อมูลที่เกี่ยวข้องกับตาราง orders
            }
        });
        res.status(200).json(payments);
    } catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch payments',
            error
        });
    }
};

// Get Payment by ID (ดึงข้อมูลการชำระเงินตาม ID)
const getPaymentById = async (req, res) => {
    const { paymentId } = req.params;

    try {
        const payment = await prisma.payments.findUnique({
            where: {
                paymentID: parseInt(paymentId, 10)
            },
            include: {
                orders: true // รวมข้อมูลคำสั่งซื้อที่เกี่ยวข้อง
            }
        });

        if (!payment) {
            return res.status(404).json({
                status: 'error',
                message: 'Payment not found'
            });
        }

        res.status(200).json(payment);
    } catch (error) {
        console.error('Error fetching payment:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch payment',
            error
        });
    }
};

// Update Payment (อัปเดตข้อมูลการชำระเงิน)
const updatePayment = async (req, res) => {
    const { paymentId } = req.params;
    const { PaymentDate, Amount, PaymentMethod, remark, payment_status } = req.body;

    const data = {};
    if (PaymentDate) data.PaymentDate = PaymentDate;
    if (Amount) data.Amount = Amount;
    if (PaymentMethod) data.PaymentMethod = PaymentMethod;
    if (remark) data.remark = remark;
    if (payment_status) data.payment_status = payment_status;

    try {
        const updatedPayment = await prisma.payments.update({
            where: { paymentID: parseInt(paymentId, 10) },
            data
        });

        res.status(200).json({
            status: 'ok',
            message: `Payment with ID = ${paymentId} is updated`,
            updatedPayment
        });
    } catch (error) {
        if (error.code === 'P2025') {
            res.status(404).json({
                status: 'error',
                message: `Payment with ID = ${paymentId} not found`
            });
        } else {
            console.error('Update payment error:', error);
            res.status(500).json({
                status: 'error',
                message: 'An unexpected error occurred'
            });
        }
    }
};

// Delete Payment (ลบข้อมูลการชำระเงิน)
const deletePayment = async (req, res) => {
    const { paymentId } = req.params;

    try {
        const deletedPayment = await prisma.payments.delete({
            where: { paymentID: parseInt(paymentId, 10) }
        });

        res.status(200).json({
            status: 'ok',
            message: `Payment with ID = ${paymentId} is deleted`,
            deletedPayment
        });
    } catch (error) {
        if (error.code === 'P2025') {
            res.status(404).json({
                status: 'error',
                message: `Payment with ID = ${paymentId} not found`
            });
        } else {
            console.error('Delete payment error:', error);
            res.status(500).json({
                status: 'error',
                message: 'An unexpected error occurred'
            });
        }
    }
};

module.exports = { createPayment, getAllPayments, getPaymentById, updatePayment, deletePayment };

