import { ROUTES } from "../config/config.js";
import { handleJSONResponse } from "../services/response-service.js";
import { EventDTO } from "../models/dto/event-dto.js";

export async function getEvents() {
    return fetch(ROUTES.V1_EVENTS, {
        method: 'GET',
        credentials: 'include'
    }).then(handleJSONResponse).then(response => 
        response.map(event => new EventDTO(event.id, event.name, event.description, event.effect))
    )
}