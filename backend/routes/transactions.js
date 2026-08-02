const express = require("express");
const router = express.Router();

const db = require("../db/connection");
const requireAuth = require("../middleware/requireAuth");

// send money
router.post("/send", requireAuth, async (req, res) => {

    try {

        const { recipientEmail, amount } = req.body;

        // Validate input
        if (!recipientEmail || !amount || amount <= 0) {
            return res.status(400).json({
                error: "Recipient email and a valid amount are required"
            });
        }

        // Find the recipient
        const [recipients] = await db.query(
            "SELECT id, fullname, email FROM users WHERE email = ?",
            [recipientEmail]
        );

        if (recipients.length === 0) {
            return res.status(404).json({
                error: "Recipient not found"
            });
        }

        const recipient = recipients[0];

        // Prevent sending money to yourself
        if (recipient.id === req.user.id) {
            return res.status(400).json({
                error: "You cannot send money to yourself"
            });
        }
        // Get sender's account
const [senderAccounts] = await db.query(
    "SELECT balance FROM accounts WHERE user_id = ?",
    [req.user.id]
);

if (senderAccounts.length === 0) {
    return res.status(404).json({
        error: "Sender wallet not found"
    });
}

const senderBalance = Number(senderAccounts[0].balance);

if (senderBalance < amount) {
    return res.status(400).json({
        error: "Insufficient funds"
    });
}

   // Start database transaction
const connection = await db.getConnection();

try {

    await connection.beginTransaction();

    // Subtract from sender
    await connection.query(
        "UPDATE accounts SET balance = balance - ? WHERE user_id = ?",
        [
            amount,
            req.user.id
        ]
    );

    // Add to recipient
    await connection.query(
        "UPDATE accounts SET balance = balance + ? WHERE user_id = ?",
        [
            amount,
            recipient.id
        ]
    );

    // Record transaction
    await connection.query(
        `INSERT INTO transactions
        (sender_id, receiver_id, amount, type, status, description)
        VALUES (?, ?, ?, 'transfer', 'completed', ?)`,
        [
            req.user.id,
            recipient.id,
            amount,
            `Transfer to ${recipient.fullname}`
        ]
    );

    await connection.commit();

    res.json({
        message: "Transfer completed successfully"
    });

} catch (err) {

    await connection.rollback();

    throw err;

} finally {

    connection.release();

}
    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Server error"
        });

    }

});

// Transfer money
router.post("/transfer", requireAuth, async (req, res) => {

    res.json({
        message: "Transfer route is working"
    });

});

// Get transaction history
router.get("/history", requireAuth, async (req, res) => {

    try {

        const [transactions] = await db.query(
            `
            SELECT
    transactions.id,
    transactions.amount,
    transactions.type,
    transactions.status,
    transactions.description,
    transactions.created_at,

    sender.fullname AS sender_name,
    receiver.fullname AS receiver_name

FROM transactions

LEFT JOIN users sender
ON transactions.sender_id = sender.id

LEFT JOIN users receiver
ON transactions.receiver_id = receiver.id

WHERE transactions.sender_id = ?
OR transactions.receiver_id = ?

ORDER BY transactions.created_at DESC
            `,
            [
                req.user.id,
                req.user.id
            ]
        );


        res.json({
            transactions
        });


    } catch(error) {

        console.log(error);

        res.status(500).json({
            error: "Server error"
        });

    }

});

module.exports = router;