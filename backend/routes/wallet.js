const express = require("express");
const router = express.Router();

const db = require("../db/connection");
const requireAuth = require("../middleware/requireAuth");


// Get wallet balance
router.get("/balance", requireAuth, async (req, res) => {
    try {
        console.log("Authenticated user:", req.user);

        const [accounts] = await db.query(
            "SELECT balance FROM accounts WHERE user_id = ?",
            [req.user.id]
        );

        console.log("Accounts:", accounts);

        if (accounts.length === 0) {
            return res.status(404).json({
                error: "Wallet not found"
            });
        }

        res.json({
            balance: accounts[0].balance
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            error: "Server error"
        });
    }
});

// Deposit money
router.post("/deposit", requireAuth, async (req, res) => {

    try {

        const { amount } = req.body;


        if (!amount || amount <= 0) {
            return res.status(400).json({
                error: "Invalid amount"
            });
        }


        await db.query(
            "UPDATE accounts SET balance = balance + ? WHERE user_id = ?",
            [
                amount,
                req.user.id
            ]
        );


        await db.query(
    `INSERT INTO transactions
    (receiver_id, amount, type, status, description)
    VALUES (?, ?, 'deposit', 'completed', ?)`,
    [
        req.user.id,
        amount,
        "Cash deposit"
    ]
);


        res.json({
            message: "Deposit successful",
            amount
        });


    } catch(error) {

        console.log(error);

        res.status(500).json({
            error: "Server error"
        });

    }

});


// Withdraw money
router.post("/withdraw", requireAuth, async (req, res) => {

    try {

        const { amount } = req.body;


        const [accounts] = await db.query(
            "SELECT balance FROM accounts WHERE user_id = ?",
            [req.user.id]
        );


        if (accounts[0].balance < amount) {
            return res.status(400).json({
                error: "Insufficient funds"
            });
        }


        await db.query(
            "UPDATE accounts SET balance = balance - ? WHERE user_id = ?",
            [
                amount,
                req.user.id
            ]
        );


     await db.query(
    `INSERT INTO transactions
    (sender_id, amount, type, status, description)
    VALUES (?, ?, 'withdraw', 'completed', ?)`,
    [
        req.user.id,
        amount,
        "Cash withdrawal"
    ]
);


        res.json({
            message: "Withdrawal successful",
            amount
        });


    } catch(error) {

        console.log(error);

        res.status(500).json({
            error: "Server error"
        });

    }

});


module.exports = router;