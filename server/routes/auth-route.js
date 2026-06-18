import express from "express";
import { authenticateLocal } from "../services/auth-service.js";
import { sendUnauthorizedError } from "../services/error-service.js";
import { userLoginRequestValidation } from "../models/dto/user-dto.js";

const router = express.Router();

router.post("/", userLoginRequestValidation, authenticateLocal, function(req, res) {
    return res.status(201).json(req.user);
});

router.get("/current", (req, res) => {
    if(req.isAuthenticated()) {
        res.json(req.user);
    }else{
        return sendUnauthorizedError("Not authenticated", res);
    }
});

router.delete("/current", (req, res) => {
    req.logout(() => {
        res.end();
    });
});

export default router;