// App configuration
export const APP_PORT = 3001;
export const APP_HOST = "localhost";

// Application URLs
const APP_V1_BASE_URL = "http://" + APP_HOST + ":" + APP_PORT + "/api/v1";
const URL_AUTH = "/session";
const URL_EVENTS = "/events";
const URL_GAMES = "/games";
const URL_METRO = "/metro";

export const ROUTES = {
    "V1_AUTH": APP_V1_BASE_URL + URL_AUTH,
    "V1_EVENTS": APP_V1_BASE_URL + URL_EVENTS,
    "V1_GAMES": APP_V1_BASE_URL + URL_GAMES,
    "V1_METRO": APP_V1_BASE_URL + URL_METRO
};

// Rules
export const MIN_DISTANCE_SEGMENT = 3;
export const MIN_DISTANCE_STOP = MIN_DISTANCE_SEGMENT + 1;
export const MAX_GAME_DURATION = 90; // seconds

export const STARTING_COINS = 20;