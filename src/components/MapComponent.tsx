import React from 'react';
import { MapPin } from 'lucide-react';

interface MapComponentProps {
  center: [number, number];
  zoom?: number;
  markers?: Array<{
    position: [number, number];
    title: string;
    description?: string;
  }>;
  className?: string;
}

function MapComponent({ center, zoom = 13, markers = [], className = "h-64 w-full rounded-lg" }: MapComponentProps) {
  // Fallback map component without external dependencies
  return (
    <div className={`${className} bg-gray-100 border border-gray-300 flex items-center justify-center relative overflow-hidden`}>
      <div className="text-center p-4">
        <MapPin className="w-12 h-12 text-purple-600 mx-auto mb-2" />
        <h3 className="font-semibold text-gray-900 mb-1">Interactive Map</h3>
        <p className="text-sm text-gray-600 mb-2">
          Location: {center[0].toFixed(4)}, {center[1].toFixed(4)}
        </p>
        {markers.length > 0 && (
          <div className="text-xs text-gray-500">
            {markers.length} marker{markers.length !== 1 ? 's' : ''} available
          </div>
        )}
      </div>
      
      {/* Decorative grid pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
          {Array.from({ length: 48 }).map((_, i) => (
            <div key={i} className="border border-gray-400"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MapComponent;