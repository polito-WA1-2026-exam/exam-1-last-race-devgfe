import { ROUTES } from "../config/config.js";
import { handleJSONResponse } from "../services/response-service.js";
import { LineDTO } from "../models/dto/line-dto.js";
import { SegmentDTO } from "../models/dto/segment-dto.js";
import { StationDTO } from "../models/dto/station-dto.js";

export async function getLines() {
    return fetch(ROUTES.V1_METRO + "/lines", {
        method: 'GET',
        credentials: 'include'
    }).then(handleJSONResponse).then(response => 
        response.map(line => new LineDTO(line.id, line.name, line.color))
    )
}

export async function getSegments() {
    return fetch(ROUTES.V1_METRO + "/segments", {
        method: 'GET',
        credentials: 'include'
    }).then(handleJSONResponse).then(response => 
        response.map(segment => new SegmentDTO(segment.from_station_id, segment.to_station_id, segment.line_id))
    )
}

export async function getStations() {
    return fetch(ROUTES.V1_METRO + "/stations", {
        method: 'GET',
        credentials: 'include'
    }).then(handleJSONResponse).then(response => 
        response.map(station => new StationDTO(station.id, station.name, station.latitude, station.longitude))
    )
}