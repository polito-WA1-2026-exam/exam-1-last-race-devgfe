import { listBestGames as listBestGamesDAO, getBestGame as getBestGameDAO } from "../dao/game-dao.js";
import { listSegments } from "../dao/segment-dao.js";
import { listStations } from "../dao/station-dao.js";
import { listEvents } from "../dao/event-dao.js";
import { NotFoundError } from "../models/errors/notfound-error.js";
import { ValidationError } from "../models/errors/validation-error.js";
import { InvalidRouteError } from "../models/errors/invalidroute-error.js";
import { gameEntityToDTO } from "../services/mapper-service.js";
import { MIN_DISTANCE_STOP, MAX_GAME_DURATION } from "../config/config.js";
import { EndpointsDTO } from "../models/dto/endpoints-dto.js";
import { SegmentDTO } from "../models/dto/segment-dto.js";
import { eventEntityToDTO } from "../services/mapper-service.js";


async function getAdjMatrix(){
    const segments = await listSegments();
    const stations = await listStations();

    const stationIdToIndex = {};
    stations.forEach((station, index) => {
        stationIdToIndex[station.id] = index;
    });

    // Init adj matrix
    const adjMatrix = [];
    for(let i=0; i<stations.length; i++){
        adjMatrix.push([]);
        for(let j=0; j<stations.length; j++){
            adjMatrix[i].push(0);
        }
    }

    // Fill adj matrix
    segments.forEach((segment) => {
        adjMatrix[stationIdToIndex[segment.from_station_id]][stationIdToIndex[segment.to_station_id]] = 1;
    });

    return {stationIdToIndex, stations, adjMatrix};
}

function isValidEndpoints(adjMatrix, endpoints){
    const stationsVisited = [];
    const {endpointsTooClose, routeFound} = _isValidEndpoints(adjMatrix, endpoints.departureStationIndex, endpoints.arrivalStationIndex, stationsVisited);
    return !endpointsTooClose && routeFound; // endpointsTooClose == false && routeFound == true
}

function _isValidEndpoints(adjMatrix, currentStationIndex, arrivalStationIndex, stationsVisited){
    if(currentStationIndex === arrivalStationIndex) {
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

    for(let i=0; i<stationsToVisit.length; i++){
        if(stationsToVisit[i] && !stationsVisited.includes(i)){
            let endpointsTooClose;
            ({endpointsTooClose, routeFound} = _isValidEndpoints(adjMatrix, i, arrivalStationIndex, stationsVisited));
            if(endpointsTooClose) return {endpointsTooClose, routeFound}; // Forced return if at least one route found is invalid
        }
    }

    stationsVisited.pop();

    return {
        "endpointsTooClose": false,
        "routeFound": routeFound
    };
}

export const getEndpoints = async () => {
    const {stations, adjMatrix} = await getAdjMatrix();

    let endpoints;
    do{
        const departureStationIndex = Math.floor(Math.random() * stations.length);
        const arrivalStationIndex = Math.floor(Math.random() * stations.length);
        endpoints = {departureStationIndex, arrivalStationIndex};
    } while(!isValidEndpoints(adjMatrix, endpoints));

    return new EndpointsDTO(stations[endpoints.arrivalStationIndex].id, stations[endpoints.departureStationIndex].id);
};

export const executeRoute = async (gameData, route) => {
    const {stationIdToIndex, adjMatrix} = await getAdjMatrix();
    const events = await listEvents();

    if(gameData == null) throw new InvalidRouteError("No active games found");

    const endpoints = gameData.endpoints;
    const duration = dayjs().unix() - gameData.startTime;

    if(duration > MAX_GAME_DURATION) throw new InvalidRouteError("Took too long to create the route");

    if(route[0].from_station_id != endpoints.departure_station_id) throw new InvalidRouteError("The start of the route does not match the one assigned in the endpoints");
    if(route[route.length-1].to_station_id != endpoints.arrival_station_id) throw new InvalidRouteError("The end of the route does not match the one assigned in the endpoints");
    
    for(let i=0; i<route.length-1; i++){
        if(route[i].to_station_id != route[i+1].from_station_id) throw new InvalidRouteError("Route interrupted");
        
        const fromStationIndex = stationIdToIndex[route[i].from_station_id];
        const toStationIndex = stationIdToIndex[route[i].to_station_id];
        if(!adjMatrix[fromStationIndex][toStationIndex]) throw new InvalidRouteError("Non-existent connection between two stations");
    }

    return route.map((segment) => {
        const eventIndex = Math.floor(Math.random() * events.length);
        segment.event = eventEntityToDTO(events[eventIndex]);
        return segment;
    });
};

export const listBestGames = async () => {
    const games = await listBestGamesDAO();
    return games.map(game => gameEntityToDTO(game))
};

export const getBestGame = async (user_id) => {
    if(user_id == null) throw new ValidationError("Invalid user id");
    const game = await getBestGameDAO(user_id);
    if(game == null) throw new NotFoundError("The user has never played");
    return gameEntityToDTO(game);
};