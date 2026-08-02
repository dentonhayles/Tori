const express = require("express");
const router = express.Router();

const db = require("../db/connection");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


router.post("/register", async (req, res) => {

    try {

        const { fullname, email, password } = req.body;


        if (!fullname || !email || !password) {
            return res.status(400).json({
                error: "All fields are required"
            });
        }


        const [existing] = await db.query(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );


        if (existing.length > 0) {
            return res.status(409).json({
                error: "Email already exists"
            });
        }


        const passwordHash = await bcrypt.hash(password, 10);


        const [result] = await db.query(
    "INSERT INTO users (fullname, email, password_hash) VALUES (?, ?, ?)",
    [
        fullname,
        email,
        passwordHash
    ]
);


const userId = result.insertId;


// Create wallet account
await db.query(
    "INSERT INTO accounts (user_id, balance) VALUES (?, ?)",
    [
        userId,
        0.00
    ]
);

        res.status(201).json({
            message: "User created",
            user:{
                id: result.insertId,
                fullname,
                email
            }
        });


    } catch(error) {

        console.log(error);

        res.status(500).json({
            error:"Server error"
        });

    }

});

router.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;


        if (!email || !password) {
            return res.status(400).json({
                error: "Email and password are required"
            });
        }


        const [users] = await db.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );


        if (users.length === 0) {
            return res.status(404).json({
                error: "User not found"
            });
        }


        const user = users[0];


        const passwordMatch = await bcrypt.compare(
            password,
            user.password_hash
        );


        if (!passwordMatch) {
            return res.status(401).json({
                error: "Invalid password"
            });
        }


        const token = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );


        res.json({
            message: "Login successful",
            token,
            user:{
                id: user.id,
                fullname: user.fullname,
                email: user.email
            }
        });


    } catch(error){

        console.log(error);

        res.status(500).json({
            error:"Server error"
        });

    }

});

module.exports = router;