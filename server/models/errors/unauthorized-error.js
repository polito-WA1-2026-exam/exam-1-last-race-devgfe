import { AppError } from "./app-error.js";

export class UnauthorizedError extends AppError{
    constructor(message){
        super(401, message, "UnauthorizedError");
    }
}