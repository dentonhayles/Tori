const express = require("express");
const router = express.Router();

const db = require("../db/connection");
const requireAuth = require("../middleware/requireAuth");
const bcrypt = require("bcryptjs");


// GET USER PROFILE
router.get("/", requireAuth, async (req, res) => {
    try {

        const [users] = await db.query(
            `
            SELECT 
                id,
                fullname,
                email,
                created_at
            FROM users
            WHERE id = ?
            `,
            [req.user.id]
        );


        if (users.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }


        res.json(users[0]);


    } catch (error) {

        console.error(error);

        res.status(500).json({
            message:"Server error"
        });
    }
});




// CHANGE PASSWORD
router.put("/password", requireAuth, async (req,res)=>{

    try {

        const {
            currentPassword,
            newPassword
        } = req.body;



        if(!currentPassword || !newPassword){

            return res.status(400).json({
                message:"All fields required"
            });

        }



        // Get current password hash

        const [users] = await db.query(
            `
            SELECT password_hash
            FROM users
            WHERE id = ?
            `,
            [req.user.id]
        );



        if(users.length === 0){

            return res.status(404).json({
                message:"User not found"
            });

        }



        const passwordMatch = await bcrypt.compare(
            currentPassword,
            users[0].password_hash
        );



        if(!passwordMatch){

            return res.status(401).json({
                message:"Current password incorrect"
            });

        }



        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );



        await db.query(
            `
            UPDATE users
            SET password_hash = ?
            WHERE id = ?
            `,
            [
                hashedPassword,
                req.user.id
            ]
        );



        res.json({
            message:"Password updated successfully"
        });



    } catch(error){

        console.error(error);

        res.status(500).json({
            message:"Server error"
        });

    }

});



module.exports = router;