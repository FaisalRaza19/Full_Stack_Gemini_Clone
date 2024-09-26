import { User } from "../Models/user.model.js";
import { fileUploadOnCloudinary } from "../utils/fileUploadOnCloudinary.js"
import { autoChatName } from "./autoChatName.js";
import { chatResult } from "./chatResult.js"
import { v1 as uuidv1 } from 'uuid';


const createNewChat = async (req, res) => {
    try {
        const { query, chatId, file } = req.body;
        const userId = req.user._id;

        // Find user without sensitive data
        const user = await User.findById(userId).select("-password -refreshToken");
        if (!user) {
            return res.status(400).json({ message: "Invalid request. User not found." });
        }

        if (!query || query.trim().length < 2) {
            return res.status(400).json({ message: "Enter a correct query." });
        }

        let result;
        let fileUrl = null;

        if (file) {
            // Upload file to Cloudinary
            const fileUploadResponse = await fileUploadOnCloudinary(file);
            if (!fileUploadResponse || !fileUploadResponse.url) {
                return res.status(400).json({ message: "File did not upload, please try again." });
            }
            fileUrl = fileUploadResponse.url;
            console.log(fileUrl);

            // Get the result from the chatResult function
            result = await chatResult(query, fileUrl);
            if (!result || typeof result !== 'string') {
                return res.status(500).json({ message: "Failed to fetch query result." });
            }
        } else {
            result = await chatResult(query);
            if (!result || typeof result !== 'string') {
                return res.status(500).json({ message: "Failed to fetch query result." });
            }
        }

        if (chatId) {
            const chatIndex = user.chatHistory.findIndex((e) => e.id === chatId);
            if (chatIndex === -1) {
                return res.status(400).json({ message: "Chat not found." });
            }

            // Add new query to the existing chat
            const queryData = fileUrl ? { file: fileUrl, query } : query;
            user.chatHistory[chatIndex].queries.push(queryData);
            user.chatHistory[chatIndex].result = result; // Update result if needed
            await user.save();

            return res.status(200).json({
                statusCode: 200,
                data: queryData,
                message: "Query added to existing chat successfully",
                result: result
            });
        } else {
            const chatName = await autoChatName(query);
            if (!chatName || typeof chatName !== 'string') {
                return res.status(500).json({ message: "Failed to generate chat name." });
            }

            const newChat = {
                id: uuidv1(),
                name: chatName,
                queries: [fileUrl ? { file: fileUrl, query } : query],
                result: result
            };

            user.chatHistory.push(newChat);
            await user.save();

            return res.status(200).json({
                statusCode: 200,
                data: newChat,
                message: "New chat created successfully"
            });
        }

    } catch (error) {
        console.error("Something went wrong while creating or updating chat:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getAllQueriesResult = async (req, res) => {
    try {
        const { chatId } = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId).select("-password -refreshToken");
        if (!user) {
            return res.status(400).json({ message: "User not found." });
        }

        if (!chatId) {
            return res.status(400).json({ message: "Chat ID is required." });
        }

        const chatIndex = user.chatHistory.findIndex(chat => chat.id === chatId);
        if (chatIndex === -1) {
            return res.status(400).json({ message: "Chat not found." });
        }

        const queries = user.chatHistory[chatIndex].queries;
        if (!queries || queries.length === 0) {
            return res.status(404).json({ message: "No queries found for the specified chat." });
        }

        const results = await Promise.all(queries.map(async (query) => {
            try {
                const result = await chatResult(query);
                return { query, result };
            } catch (err) {
                console.error(`Error processing query ${query}:`, err);
                return { query, result: "Error processing query" };
            }
        }));

        return res.status(200).json({ statusCode: 200, data: results });

    } catch (error) {
        console.error("Error while fetching chat results:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};


// const getAllQueriesResult = async (req, res) => {
//     try {
//         const { chatId } = req.body;
//         const userId = req.user._id;

//         const user = await User.findById(userId).select("-password -refreshToken");
//         if (!user) {
//             return res.status(400).json({ message: "Invalid request. User not found." });
//         }

//         if (chatId) {
//             const chatIndex = user.chatHistory.findIndex((e) => e.id === chatId);
//             if (chatIndex === -1) {
//                 return res.status(400).json({ message: "Chat not found." });
//             }

//             const queries = user.chatHistory[chatIndex].queries;
//             if (!queries || queries.length === 0) {
//                 return res.status(404).json({ message: "No queries found for the specified chat." });
//             }

//             const results = [];
//             for (let i = 0; i < queries.length; i++) {
//                 try {
//                     const result = await chatResult(queries[i]);
//                     results.push({ query: queries[i], result });
//                 } catch (err) {
//                     console.error(`Error processing query ${queries[i]}:`, err);
//                     results.push({ query: queries[i], result: "Error processing query" });
//                 }
//             }

//             return res.status(200).json({ statusCode: 200, data: results });
//         } else {
//             return res.status(400).json({ message: "Chat ID is required." });
//         }
//     } catch (error) {
//         console.error("Something went wrong while fetching chat results", error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// };

// rename chat 
const reNameChat = async (req, res) => {
    try {
        const { newName, chatId } = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId).select("-password -refreshToken");
        if (!user) {
            return res.status(400).json({ message: "Invalid request. User not found." });
        }

        if (!newName || newName.trim().length < 2) {
            return res.status(400).json({ message: "Enter a correct name." });
        }

        if (chatId) {
            const chatIndex = user.chatHistory.findIndex((e) => e.id === chatId);
            if (chatIndex === -1) {
                return res.status(400).json({ message: "Chat not found." });
            }

            user.chatHistory[chatIndex].name = newName;
            await user.save();

            return res.status(200).json({
                statusCode: 200,
                data: user.chatHistory[chatIndex].name,
                message: "Chat name changed successfully"
            });
        } else {
            return res.status(400).json({ message: "Chat ID not provided." });
        }

    } catch (error) {
        console.error("Something went wrong while renaming the chat", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// delete chat 
const deleteChat = async (req, res) => {
    try {
        const { chatId } = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId).select("-password -refreshToken");
        if (!user) {
            return res.status(400).json({ message: "Invalid request. User not found." });
        }

        if (chatId) {
            const chatIndex = user.chatHistory.findIndex((e) => e.id === chatId);
            if (chatIndex === -1) {
                return res.status(400).json({ message: "Chat not found." });
            }

            // delete chat 
            user.chatHistory.splice(chatIndex, 1)
            await user.save();

            return res.status(200).json({
                statusCode: 200,
                message: "Chat Delete successfully"
            });
        } else {
            return res.status(400).json({ message: "Chat ID not provided." });
        }

    } catch (error) {
        console.error("Something went wrong while renaming the chat", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export { createNewChat, reNameChat, deleteChat, getAllQueriesResult };