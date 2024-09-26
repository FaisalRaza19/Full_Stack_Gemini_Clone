import { Router } from "express";
import {getUser, login, logOut, register, updateAvatar} from "../Controller/user.controller.js";
import { verifyJWT } from "../Middleware/verifyJWT.js";
import {upload} from "../Middleware/Multer.js"
const router = Router();

router.route("/register").post(upload.none(),register);
router.route("/login").post(upload.none(),login);
router.route("/logOut").post(verifyJWT,logOut);
router.route("/getUser").get(verifyJWT,getUser);
router.route("/avatar").post(verifyJWT,upload.fields([
    {
        name : "avatar",
        maxCount : 1,
    }
]),updateAvatar)

export default router;