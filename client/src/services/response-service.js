import { ErrorDTO } from "../models/dto/error-dto.js";
import { DTOToAppError } from "../services/mapper-service.js";

export async function handleResponse(response) {
    if (response.ok) return response;

    const contentType = response.headers.get('Content-Type');
    if (!contentType || !contentType.includes('application/json')){
        throw new Error('HTTP error: ' + response.statusText);
    }

    const json = await response.json();
    const errorDTO = new ErrorDTO(json.code, json.message, json.name);
    throw DTOToAppError(errorDTO);
}

export async function handleJSONResponse(response) {
    await handleResponse(response);

    const contentType = response.headers.get('Content-Type');
    if (!contentType || !contentType.includes('application/json')){
        throw new TypeError(`Expected JSON, got ${contentType}`);
    }
    return await response.json();
}