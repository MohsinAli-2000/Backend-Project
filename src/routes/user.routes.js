import { Router } from "express";
import { regiterUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1,
        },
        {
            name: "coverimage",
            maxCount: 1,
        }
    ]),
    regiterUser
);

export default router;
