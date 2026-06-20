import { UserResponseDTO } from "../models/dto/user-dto.js";
import { ErrorDTO } from "../models/dto/error-dto.js";
import { AppError } from "../models/errors/app-error.js";
import { EventDTO } from "../models/dto/event-dto.js";
import { LineDTO } from "../models/dto/line-dto.js";
import { SegmentDTO } from "../models/dto/segment-dto.js";
import { StationDTO } from "../models/dto/station-dto.js";
import { GameDTO } from "../models/dto/game-dto.js";

export const userEntityToResponseDTO = (user) => {
    if (!user) return null;
    return new UserResponseDTO(user.id, user.name, user.email);
}

export const appErrorToDTO = (error) => {
    let errorDTO;
    if(error instanceof AppError){
        errorDTO = new ErrorDTO(
            error.code,
            error.message,
            error.name
        );
    }else{
        errorDTO = new ErrorDTO(
            500,
            error.message,
            "InternalServerError"
        );
    }
    return errorDTO;
}

export const eventEntityToDTO = (event) => {
    return new EventDTO(event.id, event.name, event.description, event.effect);
}

export const lineEntityToDTO = (line) => {
    return new LineDTO(line.id, line.name, line.color);
}

export const segmentEntityToDTO = (segment) => {
    return new SegmentDTO(segment.from_station_id, segment.to_station_id, segment.line_id);
}

export const stationEntityToDTO = (station) => {
    return new StationDTO(station.id, station.name, station.latitude, station.longitude);
}

export const gameEntityToDTO = (game) => {
    return new GameDTO(game.id, game.user_name, game.score);
}