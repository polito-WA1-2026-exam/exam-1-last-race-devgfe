import { MapContainer, TileLayer, CircleMarker, Polyline, Tooltip } from 'react-leaflet';
import { MAP_CENTER, MAP_DEFAULT_ZOOM, MAP_SPACING_BETWEEN_SEGMENTS } from "../config/config.js";
import 'leaflet/dist/leaflet.css';
import 'leaflet-polylineoffset';

export function MetroMap(props) {
    const lines = props.lines;
    const segments = props.segments;
    const stations = props.stations;
    const stationIdToIndex = props.stationIdToIndex;
    const lineIdToIndex = props.lineIdToIndex;

    const pairCounts = {};
    segments.forEach(segment => {
        const key = [segment.from_station_id, segment.to_station_id].sort().join('-');
        if (pairCounts[key])
            pairCounts[key].totalsToDraw += 1;
        else
            pairCounts[key] = { "totalsToDraw": 1, "totalsDrawn": 0 };
    });

    return (
        <div style={{ height: "500px", width: "100%", marginTop: "20px" }}>

            {/* CSS style */}
            <style>{`
                ${lines.map(line => `
                    .metro-line-arrow-${line.id} {
                        marker-mid: url(#arrow-head-${line.id});
                    }
                `).join('\n')}
            `}</style>

            {/* Arrow definition svg */}
            <svg style={{ position: 'absolute', top: 0, left: 0, width: '1px', height: '1px' }}>
                <defs>
                    {lines.map(line => (
                        <marker
                            key={line.id}
                            id={`arrow-head-${line.id}`}
                            viewBox="0 0 10 10"
                            refX="5"
                            refY="5"
                            markerWidth="18"
                            markerHeight="18"
                            orient="auto"
                            markerUnits="userSpaceOnUse"
                        >
                            <path d="M 2 1 L 8 5 L 2 9 z" fill={line.color || '#000'} />
                        </marker>
                    ))}
                </defs>
            </svg>

            <MapContainer center={MAP_CENTER} zoom={MAP_DEFAULT_ZOOM} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Station rendering */}
                {stations.map(station => (
                    <CircleMarker
                        key={station.id}
                        center={[station.latitude, station.longitude]}
                        pathOptions={{ color: '#000', fillColor: '#fff', fillOpacity: 1 }}
                        radius={10}
                    >
                        <Tooltip
                            permanent
                            direction="top"
                            offset={[0, -5]}
                        >
                            <strong>{station.name}</strong>
                        </Tooltip>
                    </CircleMarker>
                ))}

                {/* Segment rendering */}
                {segments.map((seg, idx) => {
                    const fromStationIndex = stationIdToIndex[seg.from_station_id];
                    const fromStation = stations[fromStationIndex];

                    const toStationIndex = stationIdToIndex[seg.to_station_id];
                    const toStation = stations[toStationIndex];

                    const lineIndex = lineIdToIndex[seg.line_id];
                    const line = lines[lineIndex];

                    const sortedId = [seg.from_station_id, seg.to_station_id].sort();
                    const key = sortedId.join('-');
                    const pair = pairCounts[key];
                    let offset = (pair.totalsDrawn - (pair.totalsToDraw - 1) / 2) * MAP_SPACING_BETWEEN_SEGMENTS;
                    if (seg.from_station_id !== sortedId[0]) {
                        offset = -offset;
                    }
                    pair.totalsDrawn++;

                    const midLatitude = (fromStation.latitude + toStation.latitude) / 2;
                    const midLongitude = (fromStation.longitude + toStation.longitude) / 2;

                    return (
                        <Polyline
                            key={idx}
                            positions={[
                                [fromStation.latitude, fromStation.longitude],
                                [midLatitude, midLongitude],
                                [toStation.latitude, toStation.longitude]
                            ]}
                            pathOptions={{
                                color: line.color,
                                weight: 3,
                                opacity: 0.8,
                                className: `metro-line-arrow-${line.id}`,
                                smoothFactor: 0
                            }}
                            offset={offset}
                        >
                            <Tooltip
                                sticky
                                interactive
                            >
                                <strong>{line.name}</strong>
                            </Tooltip>
                        </Polyline>
                    );
                })}
            </MapContainer>
        </div>
    );
}