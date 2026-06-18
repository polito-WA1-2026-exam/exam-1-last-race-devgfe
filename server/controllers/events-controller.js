import { listEvents as listEventsDAO } from "../dao/event-dao.js";
import { eventEntityToDTO } from "../services/mapper-service.js";

export const listEvents = async () => {
    const events = await listEventsDAO();
    return events.map(event => eventEntityToDTO(event))
};