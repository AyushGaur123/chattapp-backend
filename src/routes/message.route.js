import express from "express"
import { protectRoute } from "../middlewares/auth.middleware.js";
import { sidebarUsers,getMessage , sendMessage} from "../controllers/message.controller.js";
// import { } from "../controllers/message.controller.js";

const router= express.Router()

router.get("/users",protectRoute,sidebarUsers)
router.get("/:id",protectRoute,getMessage)
router.post("/send/:id",protectRoute,sendMessage)



export default router;