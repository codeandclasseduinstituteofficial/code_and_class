import express from "express";

import {
    searchLectures
}
    from "../controllers/search.controller.js";


const router = express.Router();



router.get(
    "/",
    searchLectures
);



export default router;