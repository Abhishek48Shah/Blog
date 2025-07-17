import express from "express";
import editor from "./editor";
const router = express.Router();
router.use("/editor", editor);
export default router;
