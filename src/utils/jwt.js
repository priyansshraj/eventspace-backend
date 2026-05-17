import jwt from "jsonwebtoken";

const SECRET = "your_secret_key";

export const generateToken = (user) =>{
    return jwt.sign(
        {userId: user.id, role: user.role},
        SECRET,
        {expiresIn: "1d"}
    );
};