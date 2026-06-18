import { check, validationResult } from "express-validator";
import { sendValidationError } from "../../services/error-service.js"

export function SegmentDTO(from_station_id, to_station_id, line_id, event = undefined){
    this.from_station_id = from_station_id;
    this.to_station_id = to_station_id;
    this.line_id = line_id;
    this.event = event;
}

const rules = [
    check().isArray().notEmpty(),
    check('.*.from_station_id').exists().isInt({ min: 1 }).toInt(),
    check('.*.to_station_id').exists().isInt({ min: 1 }).toInt(),
    check('.*.line_id').exists().isInt({ min: 1 }).toInt()
];

export const segmentValidation = async (req, res, next) => {
    await Promise.all(rules.map(rule => rule.run(req)));

    const invalidFields = validationResult(req);

    if (!invalidFields.isEmpty()) {
        return sendValidationError(invalidFields, res);
    }

    return next();
};