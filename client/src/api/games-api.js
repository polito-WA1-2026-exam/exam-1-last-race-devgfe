import { ROUTES } from "../config/config.js";
import { handleJSONResponse } from "../services/response-service.js";
import { GameDTO } from "../models/dto/game-dto.js";
import { EndpointsDTO } from "../models/dto/endpoints-dto.js";
import { SegmentDTO } from "../models/dto/segment-dto.js";
import { EventDTO } from "../models/dto/event-dto.js";

export async function getRanking() {
    return fetch(ROUTES.V1_GAMES + "/ranking", {
        method: 'GET',
        credentials: 'include'
    }).then(handleJSONResponse).then(response =>
        response.map(game => new GameDTO(game.id, game.user_name, game.best_score))
    )
}

export async function getMyBest() {
    return fetch(ROUTES.V1_GAMES + "/my-best", {
        method: 'GET',
        credentials: 'include'
    }).then(handleJSONResponse).then(response => new GameDTO(response.id, response.user_name, response.best_score))
}

export async function getEndpoints() {
    return fetch(ROUTES.V1_GAMES, {
        method: 'POST',
        credentials: 'include'
    }).then(handleJSONResponse).then(response => new EndpointsDTO(response.departure_station_id, response.arrival_station_id))
}

export async function executeRoute(route) {
    return fetch(ROUTES.V1_GAMES + "/current", {
        method: 'POST',
        body: JSON.stringify(route),
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    }).then(handleJSONResponse).then(response => {
        const appliedEvents = response.appliedEvents.map(event => new EventDTO(event.id, event.name, event.description, event.effect));
        const score = response.score;
        return { appliedEvents, score };
    })
}