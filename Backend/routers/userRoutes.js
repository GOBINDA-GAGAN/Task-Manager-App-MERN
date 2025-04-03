import { adminOnly, protect } from "../middlewares/authMiddleware";

const express = require("express");
const router = express.Routes();

router.get("/", protect, adminOnly, getUser);
router.get("/:id", protect, adminOnly, getUserById);
router.delete("/:id", protect, adminOnly, deleteUserById);

export default routes;
