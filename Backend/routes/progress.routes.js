import express from "express";

import {

    saveProgress,

    getMyProgress

}

    from "../controllers/progress.controller.js";


import { protect } from "../middlewares/authMiddleware.js";


const router = express.Router();



router.post(

    "/save",

    protect,

    saveProgress

);



router.get(

    "/my",

    protect,

    getMyProgress

);



export default router;