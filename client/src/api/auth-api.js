import { ROUTES } from "../config/config.js";
import { UserLoginRequestDTO, UserResponseDTO } from "../models/dto/user-dto.js";
import { handleResponse, handleJSONResponse } from "../services/response-service.js";

export async function doLogin(email, password) {
    return fetch(ROUTES.V1_AUTH, {
        method: 'POST',
        body: JSON.stringify(
            new UserLoginRequestDTO(email, password)
        ),
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    }).then(handleJSONResponse).then(response => new UserResponseDTO(response.id, response.name, response.email))
}

export async function doLogout() {
    return fetch(ROUTES.V1_AUTH + "/current", {
        method: 'DELETE',
        credentials: 'include'
    }).then(handleResponse)
}

export async function checkSession() {
    return fetch(ROUTES.V1_AUTH + "/current", {
        method: 'GET',
        credentials: "include"
    }).then(handleJSONResponse).then(response => new UserResponseDTO(response.id, response.name, response.email))
}