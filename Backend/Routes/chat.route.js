import { Router } from "express";
import { upload } from "../Middleware/Multer.js";
import { verifyJWT } from "../Middleware/verifyJWT.js";
import { createNewChat, deleteChat, reNameChat, getAllQueriesResult } from "../Controller/chat_History.js";

const chatRouter = Router();

chatRouter.route("/newChat").post(verifyJWT, upload.fields([
    {
        name: "file",
        maxCount: 1,
    }
]), createNewChat)
chatRouter.route("/getAllQueriesResult").post(verifyJWT, upload.none(), getAllQueriesResult)
chatRouter.route("/reNameChat").post(verifyJWT, upload.none(), reNameChat)
chatRouter.route("/delChat").delete(verifyJWT, upload.none(), deleteChat)

export default chatRouter;