import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in react-leaflet when using bundlers
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function LocationMarker({ onLocationSelected, initialPos }: { onLocationSelected: (lat: number, lon: number) => void, initialPos: [number, number] }) {
  const [position, setPosition] = useState<L.LatLng | null>(new L.LatLng(initialPos[0], initialPos[1]));
  
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationSelected(e.latlng.lat, e.latlng.lng);
    }
  });

  useEffect(() => {
    setPosition(new L.LatLng(initialPos[0], initialPos[1]));
  }, [initialPos]);

  return position === null ? null : (
    <Marker position={position} icon={customIcon}></Marker>
  );
}

function MapUpdater({ centerPos }: { centerPos: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(centerPos, map.getZoom());
  }, [centerPos, map]);
  return null;
}

export default function WebMap({ onLocationSelected, centerPos }: { onLocationSelected: (lat: number, lon: number) => void, centerPos?: [number, number] }) {
  const defaultPos: [number, number] = centerPos || [13.0827, 80.2707];
  
  return (
    <MapContainer center={defaultPos} zoom={13} style={{ height: '100%', width: '100%', zIndex: 0 }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapUpdater centerPos={defaultPos} />
      <LocationMarker onLocationSelected={onLocationSelected} initialPos={defaultPos} />
    </MapContainer>
  );
}
