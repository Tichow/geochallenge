import React, { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Position } from '../types/game';

interface StreetViewProps {
  position: Position;
}

const StreetView: React.FC<StreetViewProps> = ({ position }) => {
  const streetViewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      version: "weekly",
    });

    loader.load().then(() => {
      if (streetViewRef.current) {
        new google.maps.StreetViewPanorama(streetViewRef.current, {
          position,
          addressControl: false,
          showRoadLabels: false,
          // Enable navigation controls
          panControl: true,
          linksControl: true,
          zoomControl: true,
          fullscreenControl: true,
          motionTracking: false,
          motionTrackingControl: false,
          // Customize the appearance
          controlSize: 24,
          navigationControlOptions: {
            position: google.maps.ControlPosition.RIGHT_TOP
          },
          panControlOptions: {
            position: google.maps.ControlPosition.RIGHT_TOP
          }
        });
      }
    });
  }, [position]);

  return <div ref={streetViewRef} className="w-full h-full rounded-lg" />;
};

export default StreetView;