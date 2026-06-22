import { ValidationError } from "../models/errors/validation-error.js";
import { UnauthorizedError } from "../models/errors/unauthorized-error.js";
import { appErrorToDTO } from "./mapper-service.js";
import { NotFoundError } from "../models/errors/notfound-error.js";

const errorFormatter = ({msg}) => {
    return msg;
};

export const sendValidationError = (validationResult, res) => {
    const errors = validationResult.formatWith(errorFormatter);
    const validationError = new ValidationError(errors.array().join(" - "));
    return sendAppError(validationError, res);
};

export const sendUnauthorizedError = (message, res) => {
    const unauthorizedError = new UnauthorizedError(message);
    return sendAppError(unauthorizedError, res);
};

export const sendNotFoundError = (message, res) => {
    const notFoundError = new NotFoundError(message);
    return sendAppError(notFoundError, res);
};

export const sendAppError = (error, res) => {
    const errorDTO = appErrorToDTO(error);
    return res.status(errorDTO.code).json(errorDTO);
}