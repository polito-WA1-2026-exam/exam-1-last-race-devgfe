import express from "express";
import { isLoggedIn } from "../services/auth-service.js";
import { listEvents } from "../controllers/events-controller.js";
import { sendAppError } from "../services/error-service.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await listEvents();
    res.json(result);
  } catch (err) {
    return sendAppError(err, res);
  }
});

export default router;