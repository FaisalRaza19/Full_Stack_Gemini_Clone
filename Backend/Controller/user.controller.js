import bcrypt from "bcryptjs";
import { User } from "../Models/user.model.js";
import { fileUploadOnCloudinary } from "../utils/fileUploadOnCloudinary.js"
import JWT from "jsonwebtoken"


// register new user 
const register = async (req, res) => {
    try {
        // get information throw req.body 
        const { fullName, email, userName, password } = req.body;

        // check any filed is empty? 
        if ([fullName, email, userName, password].some((e) => e.trim() === "")) {
            return res.status(400).json({ message: "All fields required" })
        };

        // check all field 
        if (fullName.length < 3) {
            return res.status(400).json({ message: "Name required min 3 chracter" })
        };

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email) || email.length < 15) {
            return res.status(400).json({ message: "email required min 15 chracter and atleast 1 special Chracter." })
        }

        const specialChars = /[!@#$%^&_*(),.?":{}|<>]/;

        if (!specialChars.test(password) || password.length < 8) {
            return res.status(400).json({ message: "Password required min 8 chracter and atleast 1 special Chracter" })
        }
        if (!specialChars.test(userName) || userName.length < 12) {
            return res.status(400).json({ message: "userName required min 12 chracter and atleast 1 special Chracter" })
        }

        // Ensure email and userName are lowercase
        if (email !== email.toLowerCase() || userName !== userName.toLowerCase()) {
            return res.status(400).json({ message: "Email and username must be in lowercase" });
        }

        const checkUser = await User.findOne({
            $and: [{ email }, { userName }],
        })

        if (checkUser) {
            return res.status(400).json({ message: "Try another email or userName." })
        };

        //    generate password hash 

        const hashPass = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            fullName,
            email,
            userName,
            password: hashPass,
        });


        // generate Tokens 
        const refresh_token = JWT.sign(
            {
                id: newUser._id,
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
            }
        );

        const access_token = JWT.sign(
            {
                id: newUser._id,
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
            }
        );

        await User.findByIdAndUpdate(newUser._id, { refreshToken: refresh_token });

        const createdUser = await User.findById(newUser._id).select("-password -refreshToken");
        if (!createdUser) {
            return res.status(500).json({ message: "Internal server error" })
        };

        return res.status(200).json({
            statusCode: 200,
            data: createdUser,
            message: "User created successfully",
            access_token,
        })
    } catch (error) {
        console.log("Something went wrong to register the user", error)
    }

};

// login the user 
const login = async (req, res) => {
    try {
        const { email, userName, password } = req.body;

        // check any filed is empty? 
        if ([email, userName, password].some((e) => e.trim() === "")) {
            return res.status(400).json({ message: "All fields required" })
        };

        const checkUser = await User.findOne({
            $and: [{ email }, { userName }],
        })

        if (!checkUser) {
            return res.status(400).json({ message: "email or userName is not Valid" })
        };

        // check password 
        const checkPass = await bcrypt.compare(password, checkUser.password);
        if (!checkPass) {
            return res.status(400).json({ message: "Please enter Correct Password" })
        };

        // generate Tokens 
        const refresh_token = JWT.sign(
            {
                id: checkUser._id,
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
            }
        );

        const access_token = JWT.sign(
            {
                id: checkUser._id,
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
            }
        );

        await User.findByIdAndUpdate(checkUser._id, { refreshToken: refresh_token });

        const loginUser = await User.findById(checkUser._id).select("-password -refreshToken");
        if (!loginUser) {
            return res.status(500).json({ message: "Something went wrong to login the user" })
        }

        return res.status(200).json({
            statusCode: 200,
            data: loginUser,
            access_token: access_token,
            message: "User Login Success fully",
        })



    } catch (error) {
        console.log("Something went wrong to Login the user", error)
    }
}

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