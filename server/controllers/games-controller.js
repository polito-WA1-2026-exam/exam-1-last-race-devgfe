import { listBestGames as listBestGamesDAO, getBestGame as getBestGameDAO, addGame } from "../dao/game-dao.js";
import { listSegments } from "../dao/segment-dao.js";
import { listStations } from "../dao/station-dao.js";
import { listEvents } from "../dao/event-dao.js";
import { NotFoundError } from "../models/errors/notfound-error.js";
import { ValidationError } from "../models/errors/validation-error.js";
import { InvalidRouteError } from "../models/errors/invalidroute-error.js";
import { UnauthorizedError } from "../models/errors/unauthorized-error.js";
import { gameEntityToDTO } from "../services/mapper-service.js";
import { MIN_DISTANCE_SEGMENT, MIN_DISTANCE_STOP, MAX_GAME_DURATION, MAX_DATA_SENDING_DELAY, STARTING_COINS } from "../config/config.js";
import { EndpointsDTO } from "../models/dto/endpoints-dto.js";
import { isEqual as isEqualSegment } from "../models/dto/segment-dto.js";
import { eventEntityToDTO } from "../services/mapper-service.js";
import dayjs from "dayjs";


async function getAdjMatrix() {
    const segments = await listSegments();
    const stations = await listStations();

    const stationIdToIndex = {};
    stations.forEach((station, index) => {
        stationIdToIndex[station.id] = index;
    });

    // Init adj matrix
    const adjMatrix = [];
    for (let i = 0; i < stations.length; i++) {
        adjMatrix.push([]);
        for (let j = 0; j < stations.length; j++) {
            adjMatrix[i].push(0);
        }
    }

    // Fill adj matrix
    segments.forEach((segment) => {
        adjMatrix[stationIdToIndex[segment.from_station_id]][stationIdToIndex[segment.to_station_id]] = 1;
    });

    return { stationIdToIndex, stations, adjMatrix };
}

function isValidEndpoints(adjMatrix, endpoints) {
    const stationsVisited = [];
    const { endpointsTooClose, routeFound } = _isValidEndpoints(adjMatrix, endpoints.departureStationIndex, endpoints.arrivalStationIndex, stationsVisited);
    return !endpointsTooClose && routeFound; // endpointsTooClose == false && routeFound == true
}

function _isValidEndpoints(adjMatrix, currentStationIndex, arrivalStationIndex, stationsVisited) {
    if (currentStationIndex === arrivalStationIndex) {
        const distance = stationsVisited.length + 1; // +1 because I also count the last station (i.e. the arrival station)
        const endpointsTooClose = distance < MIN_DISTANCE_STOP ? true : false; // Filter invalid endpoints
        return {
            "endpointsTooClose": endpointsTooClose,
            "routeFound": true
        };
    }

    stationsVisited.push(currentStationIndex);

    const stationsToVisit = adjMatrix[currentStationIndex];
    let routeFound = false;

    for (let i = 0; i < stationsToVisit.length; i++) {
        if (stationsToVisit[i] && !stationsVisited.includes(i)) {
            let endpointsTooClose;
            ({ endpointsTooClose, routeFound } = _isValidEndpoints(adjMatrix, i, arrivalStationIndex, stationsVisited));
            if (endpointsTooClose) return { endpointsTooClose, routeFound }; // Forced return if at least one route found is invalid
        }
    }

    stationsVisited.pop();

    return {
        "endpointsTooClose": false,
        "routeFound": routeFound
    };
}

export const getEndpoints = async () => {
    const { stations, adjMatrix } = await getAdjMatrix();

    let endpoints;
    do {
        const departureStationIndex = Math.floor(Math.random() * stations.length);
        const arrivalStationIndex = Math.floor(Math.random() * stations.length);
        endpoints = { departureStationIndex, arrivalStationIndex };
    } while (!isValidEndpoints(adjMatrix, endpoints));

    return new EndpointsDTO(stations[endpoints.arrivalStationIndex].id, stations[endpoints.departureStationIndex].id);
};

export const executeRoute = async (gameData, route, user_id) => {
    // Start checks
    if (user_id == null) throw new UnauthorizedError("The user who sent the route is invalid");
    if (gameData == null) throw new NotFoundError("No active games found");

    const { stationIdToIndex, adjMatrix } = await getAdjMatrix();
    const events = await listEvents();

    try {
        if (route == null) throw new InvalidRouteError("A null route was passed");

        const duration = dayjs().unix() - gameData.startTime;
        //if (duration > MAX_GAME_DURATION + MAX_DATA_SENDING_DELAY) throw new InvalidRouteError("Took too long to create the route");

        if (route.length < MIN_DISTANCE_SEGMENT) throw new InvalidRouteError("Selected route too short");

        const endpoints = gameData.endpoints;
        if (route[0].from_station_id != endpoints.departure_station_id) throw new InvalidRouteError("The start of the route does not match the one assigned in the endpoints");
        if (route[route.length - 1].to_station_id != endpoints.arrival_station_id) throw new InvalidRouteError("The end of the route does not match the one assigned in the endpoints");

        const segmentsVisited = [];
        for (let i = 0; i < route.length; i++) {
            if (i < route.length - 1)
                if (route[i].to_station_id != route[i + 1].from_station_id) throw new InvalidRouteError("Route interrupted");

            const fromStationIndex = stationIdToIndex[route[i].from_station_id];
            const toStationIndex = stationIdToIndex[route[i].to_station_id];
            if (!adjMatrix[fromStationIndex][toStationIndex]) throw new InvalidRouteError("Non-existent connection between two stations");

            const segment = route[i];
            const segmentAlreadyUsed = segmentsVisited.some((seg) => isEqualSegment(segment, seg));
            if (segmentAlreadyUsed) throw new InvalidRouteError("Segment already used");
            segmentsVisited.push(segment);
        }
    } catch (err) {
        await addGame(user_id, 0);
        throw err;
    }
    
    // If everything is correct
    let score = STARTING_COINS;
    const appliedEvents = [];
    for(let i=0; i<route.length; i++){
        const eventIndex = Math.floor(Math.random() * events.length);
        const selectedEvent = events[eventIndex];
        score += selectedEvent.effect;
        appliedEvents.push(eventEntityToDTO(selectedEvent));
    }

    if (score < 0) score = 0;
    await addGame(user_id, score);

    return { appliedEvents, score };
};

export const listBestGames = async () => {
    const games = await listBestGamesDAO();
    return games.map(game => gameEntityToDTO(game))
};

export const getBestGame = async (user_id) => {
    if (user_id == null) throw new ValidationError("Invalid user id");
    const game = await getBestGameDAO(user_id);
    if (game == null) throw new NotFoundError("The user has never played");
    return gameEntityToDTO(game);
};