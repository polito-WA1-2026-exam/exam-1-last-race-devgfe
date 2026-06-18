import express from "express";
import { isLoggedIn } from "../services/auth-service.js";
import { listLines, listSegments, listStations } from "../controllers/metro-controller.js";
import { sendAppError } from "../services/error-service.js";

const router = express.Router();

router.get("/lines", isLoggedIn, async (req, res) => {
  try {
    const result = await listLines();
    res.json(result);
  } catch (err) {
    return sendAppError(err, res);
  }
});

router.get("/segments", isLoggedIn, async (req, res) => {
  try {
    const result = await listSegments();
    res.json(result);
  } catch (err) {
    return sendAppError(err, res);
  }
});

router.get("/stations", isLoggedIn, async (req, res) => {
  try {
    const result = await listStations();
    res.json(result);
  } catch (err) {
    return sendAppError(err, res);
  }
});

export default router;