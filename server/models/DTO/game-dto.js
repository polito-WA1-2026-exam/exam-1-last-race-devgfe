export function GameDTO(user_name, departure_station_name, arrival_station_name, timestamp, best_score){
    this.user_name = user_name;
    this.departure_station_name = departure_station_name;
    this.arrival_station_name = arrival_station_name;
    this.timestamp = timestamp.format("YYYY-MM-DD HH:mm:ss");
    this.best_score = best_score;
}