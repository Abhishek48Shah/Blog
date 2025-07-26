import express from "express";
import editor from "./editor";
import writer from "./writer";
const router = express.Router();
router.use("/editor", editor);
router.use("/writer", writer);
export default router;
