import { listBestGames as listBestGamesDAO, getBestGame as getBestGameDAO } from "../dao/game-dao.js";
import { NotFoundError } from "../models/errors/notfound-error.js";
import { ValidationError } from "../models/errors/validation-error.js";
import { gameEntityToDTO } from "../services/mapper-service.js";

export const getEndpoints = async () => {
    
};

export const executeRoute = async () => {

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