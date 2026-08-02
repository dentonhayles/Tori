const express = require("express");
const router = express.Router();

const db = require("../db/connection");
const requireAuth = require("../middleware/requireAuth");


router.post("/", requireAuth, async (req, res) => {

    const senderId = req.user.id;

    const {
        receiverEmail,
        amount,
        description
    } = req.body;


    try {

        // Find receiver
        const [receiver] = await db.query(
            "SELECT id FROM users WHERE email = ?",
            [receiverEmail]
        );


        if (receiver.length === 0) {
            return res.status(404).json({
                error: "Receiver not found"
            });
        }


        const receiverId = receiver[0].id;


        if (senderId === receiverId) {
            return res.status(400).json({
                error: "Cannot transfer to yourself"
            });
        }


        // Check sender balance
        const [senderAccount] = await db.query(
            "SELECT balance FROM accounts WHERE user_id = ?",
            [senderId]
        );


        if (senderAccount.length === 0) {
            return res.status(404).json({
                error: "Sender wallet not found"
            });
        }


        if (senderAccount[0].balance < amount) {
            return res.status(400).json({
                error: "Insufficient balance"
            });
        }



        // Remove money from sender
        await db.query(
            `
            UPDATE accounts
            SET balance = balance - ?
            WHERE user_id = ?
            `,
            [
                amount,
                senderId
            ]
        );



        // Add money to receiver
        await db.query(
            `
            UPDATE accounts
            SET balance = balance + ?
            WHERE user_id = ?
            `,
            [
                amount,
                receiverId
            ]
        );



        // Save transaction
        await db.query(
            `
            INSERT INTO transactions
            (
                sender_id,
                receiver_id,
                amount,
                type,
                status,
                description
            )
            VALUES (?, ?, ?, ?, ?, ?)
            `,
            [
                senderId,
                receiverId,
                amount,
                "transfer",
                "completed",
                description || "Money transfer"
            ]
        );


        res.json({
            message: "Transfer successful"
        });


    } catch(error){

        console.error(error);

        res.status(500).json({
            error:"Transfer failed"
        });

    }

});


module.exports = router;