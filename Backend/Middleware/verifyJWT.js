import JWT from "jsonwebtoken";
import { User } from "../Models/user.model.js";

export const verifyJWT = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({ message: "Token is required" });
        }

        const decodedToken = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (!decodedToken) {
            return res.status(403).json({ message: "Token is invalid" });
        }
        const user = await User.findById(decodedToken.id).select("-password -refreshToken");

        if (!user) {
            return res.status(401).json({ message: "Unauthorized request, user not found" });
        }

        req.user = user;
        next();

    } catch (error) {
        if (error instanceof JWT.JsonWebTokenError) {
            return res.status(403).json({ message: "Invalid token" });
        }
        if (error instanceof JWT.TokenExpiredError) {
            return res.status(403).json({ message: "Token expired" });
        }
        console.error("Error verifying token:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};