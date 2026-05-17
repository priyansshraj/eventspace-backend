import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;

export const generateToken = (user) =>{
    return jwt.sign(
        {userId: user.id, role: user.role},
        SECRET,
        {expiresIn: "1d"}
    );
};