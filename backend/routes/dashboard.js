const express = require("express");
const router = express.Router();

const db = require("../db/connection");
const requireAuth = require("../middleware/requireAuth");


// Dashboard data
router.get("/", requireAuth, async (req, res) => {

    try {

        // User
        const [users] = await db.query(
            `
            SELECT id, fullname, email
            FROM users
            WHERE id = ?
            `,
            [req.user.id]
        );


        if (users.length === 0) {
            return res.status(404).json({
                error: "User not found"
            });
        }


        const user = users[0];



        // Wallet
        const [accounts] = await db.query(
            `
            SELECT balance
            FROM accounts
            WHERE user_id = ?
            `,
            [req.user.id]
        );


        const wallet = {
            balance: accounts.length
                ? accounts[0].balance
                : 0
        };





        // Income
        const [incomeRows] = await db.query(
            `
            SELECT COALESCE(SUM(amount),0) AS total
            FROM transactions
            WHERE
            (
                receiver_id = ?
                AND type = 'deposit'
            )
            OR
            (
                receiver_id = ?
                AND type = 'transfer'
            )
            `,
            [
                req.user.id,
                req.user.id
            ]
        );



        // Expenses
        const [expenseRows] = await db.query(
            `
            SELECT COALESCE(SUM(amount),0) AS total
            FROM transactions
            WHERE sender_id = ?
            AND type = 'transfer'
            `,
            [
                req.user.id
            ]
        );



        const stats = {

            income: incomeRows[0].total,

            expenses: expenseRows[0].total

        };






        // Recent transactions
        const [transactions] = await db.query(
            `
            SELECT
                id,
                type,
                amount,
                description,
                created_at
            FROM transactions
            WHERE sender_id = ?
            OR receiver_id = ?
            ORDER BY created_at DESC
            LIMIT 5
            `,
            [
                req.user.id,
                req.user.id
            ]
        );





        // Real monthly chart data
        const [monthlyRows] = await db.query(
            `
            SELECT
                MONTH(created_at) AS monthNumber,

                SUM(
                    CASE
                        WHEN 
                        (
                            receiver_id = ?
                            AND type = 'deposit'
                        )
                        OR
                        (
                            receiver_id = ?
                            AND type = 'transfer'
                        )
                        THEN amount
                        ELSE 0
                    END
                ) AS income,


                SUM(
                    CASE
                        WHEN
                        sender_id = ?
                        AND type = 'transfer'
                        THEN amount
                        ELSE 0
                    END
                ) AS expenses


            FROM transactions

            WHERE sender_id = ?
            OR receiver_id = ?

            GROUP BY MONTH(created_at)

            ORDER BY monthNumber
            `,
            [
                req.user.id,
                req.user.id,
                req.user.id,
                req.user.id,
                req.user.id
            ]
        );





        const monthNames = [
            "",
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
        ];



        const monthlyStats = monthlyRows.map(row => ({
            
            month: monthNames[row.monthNumber],

            income: Number(row.income),

            expenses: Number(row.expenses)

        }));







        res.json({

            user,

            wallet,

            stats,

            recentTransactions: transactions,

            monthlyStats

        });



    } catch(error) {


        console.log(error);


        res.status(500).json({

            error: "Server error"

        });

    }

});


module.exports = router;