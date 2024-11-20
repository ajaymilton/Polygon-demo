import { DrawingManagerF, GoogleMap, LoadScript, Marker, Polygon } from "@react-google-maps/api";
import React, { useCallback, useRef, useState } from "react";

const App = () => {
  const [isLibrariesLoaded, setIsLibrariesLoaded] = useState(false);
  const [markers, setMarker] = useState([]);
  const [staticMarker, setStaticMarker] = useState(null);
  const drawingManagerRef = useRef(null);
  const currentPolygon = useRef(null);
  const canDrawPolygon = useRef(true);
  const [manualPolygon, setManualPolygon] = useState(null);

  const mapContainerStyle = {
    height: "100vh",
    width: "100%",
  };

  const center = {
    lat: 20.5937,
    lng: 78.9629,
  };

  const onPolygonComplete = useCallback((polygonInstance) => {
    if (!canDrawPolygon.current) {
      polygonInstance.setMap(null);
      return;
    }
    currentPolygon.current = polygonInstance;
    canDrawPolygon.current = false;
    if (drawingManagerRef.current) {
      drawingManagerRef.current.setDrawingMode(null);
    }

    const path = polygonInstance.getPath();
    const coordinates = [];
    path.forEach((latLng) => {
      coordinates.push({
        lat: latLng.lat(),
        lng: latLng.lng(),
      });
    });
    console.log("Polygon coordinates:", coordinates);
  }, []);

  const onMapClick = (e) => {
    setMarker([]);
    setMarker((current) => [
      ...current,
      {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      },
    ]);
  };

  const resetPolygon = () => {
    setManualPolygon([]);
    setStaticMarker(null);
    if (currentPolygon.current) {
      console.log("Resetting polygon...");
      currentPolygon.current.setMap(null);
      currentPolygon.current = null;
    }
    canDrawPolygon.current = true;
    if (drawingManagerRef.current) {
      drawingManagerRef.current.setDrawingMode("polygon");
    }

    console.log("Polygon reset. Ready to draw a new one.");
  };

  const setManualPolygonHandler = () => {
    const coordinates = [
      { lat: 20.627409436883116, lng: 78.98820288067645 },
      { lat: 20.628694682313736, lng: 79.04862768536395 },
      { lat: 20.587722146769398, lng: 79.04965765362567 },
      { lat: 20.58691865361481, lng: 78.99009115582294 },
    ];
    setManualPolygon(coordinates);

    const staticMarkerPosition = { lat: 20.607, lng: 79.01 }; 
    setStaticMarker(staticMarkerPosition);
  };

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
        {isLibrariesLoaded && canDrawPolygon.current && (
          <DrawingManagerF
            ref={drawingManagerRef}
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
        <button
          onClick={resetPolygon}
          style={{
            position: "absolute",
            top: "60px",
            left: "10px",
            zIndex: 5,
            padding: "10px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Reset Polygon
        </button>
        <button
          onClick={setManualPolygonHandler}
          style={{
            position: "absolute",
            top: "120px",
            left: "10px",
            zIndex: 5,
            padding: "10px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Set Manual Polygon
        </button>
        {manualPolygon && (
          <Polygon
            paths={manualPolygon}
            options={{
              fillColor: "#f44336",
              fillOpacity: 0.35,
              strokeColor: "#f44336",
              strokeOpacity: 0.8,
              strokeWeight: 2,
            }}
          />
        )}
        {staticMarker && (
          <Marker
            position={staticMarker}
          />
        )}
        {markers?.map((marker, idx) => (
          <Marker
            key={idx}
            position={{
              lat: marker.lat,
              lng: marker.lng,
            }}
            draggable={true}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default App;
