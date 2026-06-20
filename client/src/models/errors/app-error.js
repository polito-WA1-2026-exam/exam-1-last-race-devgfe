export class AppError extends Error {
    constructor(code, message, name){
        super(message);
        this.code = code;
        this.name = name;
    }
}