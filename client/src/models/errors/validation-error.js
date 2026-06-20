import { AppError } from "./app-error.js";

export class ValidationError extends AppError{
    constructor(message){
        super(422, message, "ValidationError");
    }
}