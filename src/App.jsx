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
    lat: 13.078385399481105,
    lng: 80.21427191092893,
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
      {lat: 13.084661264969156, lng: 80.21300684321591},
      {lat: 13.084786668286466, lng: 80.2103031765289},
      {lat: 13.0825816506569, lng: 80.21027099002072},
      {lat: 13.082309940958625, lng: 80.2102495323486}, 
      {lat: 13.082341292092927, lng: 80.2098525654144},
      {lat: 13.07914345586022, lng: 80.20977746356198},
      {lat: 13.078809039218628, lng: 80.20990620959469},
      {lat: 13.078641830727788, lng: 80.2106464992828}, 
      {lat: 13.078359666142433, lng: 80.21151553500363},
      {lat: 13.077889391116143, lng: 80.21268497813412},
      {lat: 13.077074245613165, lng: 80.21350036967465},
      {lat: 13.076687573086394, lng: 80.21436940539547},
      {lat: 13.07687568412109, lng: 80.21503459323117},
      {lat: 13.077711731428401, lng: 80.21550666201779},
      {lat: 13.078965797075837, lng: 80.21561395037838}, 
      {lat: 13.07986454020057, lng: 80.21569978106686}, 
      {lat: 13.080470667435318, lng: 80.21670829165646},
      {lat: 13.080951387975926, lng: 80.2176524292297}, 
      {lat: 13.08222633791429, lng: 80.21773825991818}, 
      {lat: 13.08398199589184, lng: 80.21778117526242}, 
      {lat: 13.08440000785323, lng: 80.21773825991818},
      {lat: 13.084556762156012, lng: 80.21751295436093},
      {lat: 13.084567212439328, lng: 80.2163005958862},
      {lat: 13.084650814689835, lng: 80.21459471095272}
    ];
    setManualPolygon(coordinates);

    const staticMarkerPosition = { lat: 13.078385399481105, lng: 80.21427191092893 };
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
            top: "100px",
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
            top: "160px",
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
