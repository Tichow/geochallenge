import React, { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Position } from '../types/game';

interface MapProps {
  onGuess: (position: Position) => void;
  disabled?: boolean;
  showMarkers?: boolean;
  markers?: Position[];
}

const Map: React.FC<MapProps> = ({ onGuess, disabled, showMarkers, markers }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map>();
  const markerRef = useRef<google.maps.Marker>();

  useEffect(() => {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      version: "weekly",
    });

    loader.load().then(() => {
      if (mapRef.current) {
        const map = new google.maps.Map(mapRef.current, {
          center: { lat: 0, lng: 0 },
          zoom: 2,
          streetViewControl: false,
          fullscreenControl: false,
          mapTypeControl: false,
        });

        mapInstanceRef.current = map;

        if (!disabled) {
          map.addListener('click', (e: google.maps.MapMouseEvent) => {
            const position = e.latLng?.toJSON();
            if (position) {
              if (markerRef.current) {
                markerRef.current.setPosition(position);
              } else {
                markerRef.current = new google.maps.Marker({
                  position,
                  map,
                });
              }
              onGuess(position);
            }
          });
        }
      }
    });
  }, []);

  useEffect(() => {
    if (showMarkers && markers && mapInstanceRef.current) {
      markers.forEach((position, index) => {
        new google.maps.Marker({
          position,
          map: mapInstanceRef.current,
          label: String(index + 1),
        });
      });
    }
  }, [showMarkers, markers]);

  return <div ref={mapRef} className="w-full h-full rounded-lg" />;
};

export default Map;