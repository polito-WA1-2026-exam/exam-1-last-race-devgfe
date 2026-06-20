import { AppError } from "./app-error.js";

export class InvalidRouteError extends AppError{
    constructor(message){
        super(400, message, "InvalidRouteError");
    }
}