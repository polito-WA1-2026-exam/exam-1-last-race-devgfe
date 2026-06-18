import { body, validationResult } from "express-validator";
import { sendValidationError } from "../../services/error-service.js"

export function UserLoginRequestDTO(email, password){
    this.username = email;
    this.password = password;
}

export function UserResponseDTO(id, name, email){
    this.id = id;
    this.name = name;
    this.email = email;
}

const rules = [
    body('username').notEmpty().isEmail().normalizeEmail(),
    body('password').notEmpty().isString()
];

export const userLoginRequestValidation = async (req, res, next) => {
    await Promise.all(rules.map(rule => rule.run(req)));

    const invalidFields = validationResult(req);

    if (!invalidFields.isEmpty()) {
        return sendValidationError(invalidFields, res);
    }

    return next();
}