import bcrypt from "bcryptjs";
import { User } from "../Models/user.model.js";
import { fileUploadOnCloudinary } from "../utils/fileUploadOnCloudinary.js"
import JWT from "jsonwebtoken"


// register new user 
const register = async (req, res) => {
    try {
        // Get information from req.body
        const { fullName, email, password } = req.body;

        // Check if any field is empty
        if ([fullName, email, password].some((e) => e.trim() === "")) {
            return res.status(400).json({ message: "All fields required" });
        }

        // Validate fullName
        if (fullName.length < 3) {
            return res.status(400).json({ message: "Name required min 3 characters" });
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // Validate password
        const specialChars = /[!@#$%^&_*(),.?":{}|<>]/;
        if (!specialChars.test(password) || password.length < 8) {
            return res.status(400).json({
                message: "Password required min 8 characters and at least 1 special character",
            });
        }

        // Ensure email is lowercase
        if (email !== email.toLowerCase()) {
            return res.status(400).json({ message: "Email must be in lowercase" });
        }

        // Check if email already exists
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already in use" });
        }

        // Function to generate unique username
        const generateUniqueUserName = async (baseName) => {
            let username = baseName.toLowerCase().replace(/\s+/g, "") + Math.floor(Math.random() * 1000);
            let exists = await User.findOne({ userName: username });
            while (exists) {
                username = baseName.toLowerCase().replace(/\s+/g, "") + Math.floor(Math.random() * 1000);
                exists = await User.findOne({ userName: username });
            }
            return username;
        };

        const userName = await generateUniqueUserName(fullName);

        // Generate password hash
        const hashPass = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await User.create({
            fullName,
            email,
            userName,
            password: hashPass,
        });

        // Generate tokens
        const refresh_token = JWT.sign({ id: newUser._id }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        });

        const access_token = JWT.sign({ id: newUser._id }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        });

        await User.findByIdAndUpdate(newUser._id, { refreshToken: refresh_token });

        const createdUser = await User.findById(newUser._id).select("-password -refreshToken");
        if (!createdUser) {
            return res.status(500).json({ message: "Internal server error" });
        }

        return res.status(200).json({
            statusCode: 200,
            data: createdUser,
            message: "User created successfully",
            access_token,
        });
    } catch (error) {
        console.error("Something went wrong during registration", error);
        return res.status(500).json({ message: "Server error" });
    }
};

// login the user 
const login = async (req, res) => {
    try {
        const { identifier, password } = req.body;

        // Validate fields
        if (!identifier?.trim() || !password?.trim()) {
            return res.status(400).json({ message: "Both fields are required" });
        }

        // Find user by email or username
        const checkUser = await User.findOne({
            $or: [{ email: identifier }, { userName: identifier }],
        });

        if (!checkUser) {
            return res.status(400).json({ message: "Email or username is not valid" });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, checkUser.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        // Generate Tokens
        const refresh_token = JWT.sign(
            { id: checkUser._id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
        );

        const access_token = JWT.sign(
            { id: checkUser._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
        );

        // Save refresh token in DB
        await User.findByIdAndUpdate(checkUser._id, { refreshToken: refresh_token });

        // Return user data without sensitive info
        const loginUser = await User.findById(checkUser._id).select("-password -refreshToken");
        if (!loginUser) {
            return res.status(500).json({ message: "Something went wrong during login" });
        }

        return res.status(200).json({
            statusCode: 200,
            data: loginUser,
            access_token,
            message: "User logged in successfully",
        });
    } catch (error) {
        console.error("Error logging in user:", error);
        return res.status(500).json({ message: "Server error during login" });
    }
};

// logOut the User 
const logOut = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(400).json({ message: "User is unauthroized" })
        };

        // delete refreshToken from database 
        await User.findByIdAndUpdate(req.user._id, { $set: { refreshToken: "" } })

        // clear cookies 
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken")

        return res.status(200).json({ statusCode: 200, message: "User logOut Successfully" })

    } catch (error) {
        console.log("Something went wrong to logOut the user", error)
    }
}

// login is required  update avatar;

const updateAvatar = async (req, res) => {
    try {
        // get user id from req.user
        const userId = req.user._id;

        // check if avatar file is provided
        if (!req.files || !req.files.avatar || req.files.avatar.length === 0) {
            return res.status(400).json({ message: "Avatar file is required" });
        }

        // get avatar file path from req.files
        const avatarPath = req.files.avatar[0].path;

        // check if the user exists
        const user = await User.findById(userId).select("-password -refreshToken");
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }

        // upload avatar to Cloudinary
        const fileUpload = await fileUploadOnCloudinary(avatarPath);

        // If user has an existing avatar, clear it
        if (user.avatar) {
            await User.findByIdAndUpdate(userId, { $unset: { avatar: "" } });
        }
        await User.findByIdAndUpdate(userId, { avatar: fileUpload.url });

        return res.status(200).json({
            statusCode: 200,
            data: fileUpload.url,
            message: "Avatar updated successfully"
        });

    } catch (error) {
        console.error("Error updating avatar:", error);
        return res.status(500).json({ message: "Something went wrong while updating the avatar", error: error.message });
    }
}

// get user
const getUser = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId).select("-password -refreshToken");
        if (!user) {
            return res.status(400).json({ message: "User did not exist" })
        };

        return res.status(200).json({ statusCode: 200, data: user, message: "User get Successfully" })

    } catch (error) {
        console.log("something went wrong to get the user", error);
    }
}

export { register, login, logOut, getUser, updateAvatar };