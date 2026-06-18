export function SegmentDTO(from_station_id, to_station_id, line_id, event = null){
    this.from_station_id = from_station_id;
    this.to_station_id = to_station_id;
    this.line_id = line_id;
    this.event = event;
}