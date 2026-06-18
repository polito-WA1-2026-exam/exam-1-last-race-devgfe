import express from "express";
import { isLoggedIn } from "../services/auth-service.js";
import { getEndpoints, executeRoute, listBestGames, getBestGame } from "../controllers/games-controller.js";
import { SegmentDTO, segmentValidation } from "../models/dto/segment-dto.js";
import { sendAppError } from "../services/error-service.js";

const router = express.Router();

router.post("/", isLoggedIn, async (req, res) => {
    try {
        const result = await getEndpoints();
        res.json(result);
    } catch (err) {
        return sendAppError(err, res);
    }
});

router.post("/current/route", isLoggedIn, segmentValidation, async (req, res) => {
    const route = req.body.map(segment => new SegmentDTO(segment.from_station_id, segment.to_station_id, segment.line_id));
    try {
        const result = await executeRoute(route);
        res.json(result);
    } catch (err) {
        return sendAppError(err, res);
    }
});

router.get("/ranking", isLoggedIn, async (req, res) => {
  try {
    const result = await listBestGames();
    res.json(result);
  } catch (err) {
    return sendAppError(err, res);
  }
});

router.get("/my-best", isLoggedIn, async (req, res) => {
  try {
    const result = await getBestGame(req.user?.id);
    res.json(result);
  } catch (err) {
    return sendAppError(err, res);
  }
});


export default router;