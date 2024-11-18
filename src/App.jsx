import { DrawingManagerF, GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import React, { useCallback, useState } from "react";

const App = () => {
  const [isLibrariesLoaded, setIsLibrariesLoaded] = useState(false);
  const [markers, setMarker] = useState([])

  const mapContainerStyle = {
    height: "100vh",
    width: "100%",
  };

  const center = {
    lat: 20.5937,
    lng: 78.9629,
  };

  const onPolygonComplete = useCallback((polygon) => {
    console.log("Polygon drawn");
    const path = polygon.getPath();
    const coordinates = [];
    path.forEach((latLng) => {
      coordinates.push({
        lat: latLng.lat(),
        lng: latLng.lng(),
      });
    });
    console.log("Polygon coordinates:", coordinates);
    // polygon.setMap(null);
  }, []);

  const onMapClick = (e) => {
    setMarker([])
    setMarker((current) => [
      ...current,
      {
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      }
    ]);
  };

  console.log(markers)
 
  return (
    <LoadScript
      googleMapsApiKey="AIzaSyCbCiahMrKVXrB6mJ-dFeyHi40XlsjwxnQ"
      libraries={["drawing"]}
      onLoad={() => setIsLibrariesLoaded(true)} 
    >
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={13}
        onClick={onMapClick}
      >
        {isLibrariesLoaded && (
          <DrawingManagerF
            onPolygonComplete={onPolygonComplete}
            options={{
              drawingControl: true,
              drawingControlOptions: {
                position: window.google.maps.ControlPosition.TOP_CENTER,
                drawingModes: ["polygon"],
              },
              polygonOptions: {
                fillColor: "#000000",
                fillOpacity: 0.5,
                strokeColor: "#2196f3",
                strokeWeight: 2,
                clickable: true,
                editable: true,
                draggable: false,
              },
            }}
          />
        )}
        {markers?.map((marker, idx) => (
            <Marker 
              key={idx}
              position={{ 
                lat: marker.lat,
                lng: marker.lng 
              }} 
              draggable={true} 
            />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default App;
