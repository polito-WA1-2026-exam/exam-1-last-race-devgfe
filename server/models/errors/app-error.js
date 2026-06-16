export function AppError(code, message, name){
    this.code = code;
    this.message = message;
    this.name = name;
}