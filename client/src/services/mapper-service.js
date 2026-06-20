import { AppError } from "../models/errors/app-error.js";
import { InvalidRouteError } from "../models/errors/invalidroute-error.js";
import { NotFoundError } from "../models/errors/notfound-error.js";
import { UnauthorizedError } from "../models/errors/unauthorized-error.js";
import { ValidationError } from "../models/errors/validation-error.js";

export const DTOToAppError = (errorDTO) => {
    switch (errorDTO.name) {
        case "InvalidRouteError":
            return new InvalidRouteError(errorDTO.message);
        case "NotFoundError":
            return new NotFoundError(errorDTO.message);
        case "UnauthorizedError":
            return new UnauthorizedError(errorDTO.message);
        case "ValidationError":
            return new ValidationError(errorDTO.message);
        default:
            return new AppError(errorDTO.code, errorDTO.message, errorDTO.name);
    }
}