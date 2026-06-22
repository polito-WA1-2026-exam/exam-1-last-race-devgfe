import { body, validationResult } from "express-validator";
import { sendValidationError } from "../../services/error-service.js"

export function SegmentDTO(from_station_id, to_station_id, line_id){
    this.from_station_id = from_station_id;
    this.to_station_id = to_station_id;
    this.line_id = line_id;
}

const rulesSegmentValidation = [
    body('*.from_station_id').exists().isInt({ min: 1 }).toInt(),
    body('*.to_station_id').exists().isInt({ min: 1 }).toInt(),
    body('*.line_id').exists().isInt({ min: 1 }).toInt()
];

const rulesRouteValidation = [
    body().isArray({ min: 1 })
];

const segmentValidation = async (req, res, next) => {
    await Promise.all(rulesSegmentValidation.map(rule => rule.run(req)));

    const invalidFields = validationResult(req);

    if (!invalidFields.isEmpty()) {
        return sendValidationError(invalidFields, res);
    }

    return next();
};

export const routeValidation = async (req, res, next) => {
    await Promise.all(rulesRouteValidation.map(rule => rule.run(req)));

    const invalidFields = validationResult(req);

    if (!invalidFields.isEmpty()) {
        return sendValidationError(invalidFields, res);
    }

    return segmentValidation(req, res, next);
};

export const isEqual = (segmentA, segmentB) => {
    if (segmentA.from_station_id != segmentB.from_station_id) return false;
    if (segmentA.to_station_id != segmentB.to_station_id) return false;
    if (segmentA.line_id != segmentB.line_id) return false;
    return true;
};