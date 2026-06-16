import dayjs from "dayjs";

export function GameDAO(id, user_id, departure_station_id, arrival_station_id, timestamp, score){
    this.id = id;
    this.user_id = user_id;
    this.departure_station_id = departure_station_id;
    this.arrival_station_id = arrival_station_id;
    this.timestamp = dayjs(timestamp);
    this.score = score;
}