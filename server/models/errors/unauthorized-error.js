import AppError from "./app-error.js";

export function UnauthorizedError(message){
    return AppError(401, message, "UnauthorizedError")
}