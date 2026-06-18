import { listLines as listLinesDAO } from "../dao/line-dao.js";
import { listSegments as listSegmentsDAO } from "../dao/segment-dao.js";
import { listStations as listStationsDAO } from "../dao/station-dao.js";
import { lineEntityToDTO, segmentEntityToDTO, stationEntityToDTO } from "../services/mapper-service.js";

export const listLines = async () => {
    const lines = await listLinesDAO();
    return lines.map(line => lineEntityToDTO(line))
};

export const listSegments = async () => {
    const segments = await listSegmentsDAO();
    return segments.map(segment => segmentEntityToDTO(segment))
};

export const listStations = async () => {
    const stations = await listStationsDAO();
    return stations.map(stations => stationEntityToDTO(stations))
};