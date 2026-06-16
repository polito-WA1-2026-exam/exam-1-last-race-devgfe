import AppError from "./app-error.js";

export function InvalidRouteError(message){
    return AppError(400, message, "InvalidRoute")
}