import express from "express";

import {
  deleteAllUsers_FOR_TESTING,
} from "../controller/user-controller.js";

const router = express.Router();

router.get("/deleteAllUsers", deleteAllUsers_FOR_TESTING);

export default router;
