const jwt = require("jsonwebtoken");


function requireAuth(req, res, next) {

   const authHeader = req.headers.authorization;

console.log("Authorization header:", authHeader);
console.log("JWT SECRET:", process.env.JWT_SECRET);

    if (!authHeader) {
        return res.status(401).json({
            error: "No token provided"
        });
    }


    const token = authHeader.split(" ")[1];


    if (!token) {
        return res.status(401).json({
            error: "Invalid token format"
        });
    }


    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );


        req.user = decoded;

        next();


    } catch(error) {

        return res.status(401).json({
            error: "Invalid or expired token"
        });

    }

}


module.exports = requireAuth;