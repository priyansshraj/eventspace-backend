import jwt from "jsonwebtoken";

const SECRET = "your_secret_key";

export const authMiddleware = (req, res, next) =>{
    try{
        const authHeader = req.headers.authorization;

        // 1. check token exists
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({message: "Unauthorized "});
        }

        // 2. extract token
        const token = authHeader.split(" ")[1];

        // 3. verify token
        const decoded = jwt.verify(token, SECRET);

        // 4. attach user to request
        req.user = decoded;

        next();
    } catch(error){
        return res.status(401).json({message: "Invalid token"});
    }
}