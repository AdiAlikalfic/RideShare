import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";

function MapComponent({onLocationSelect}) {
  const [position, setPosition] = useState(null);

  function LocationMarker({onLocationSelect}) {
    const [markerPosition, setMarkerPosition] = useState(null);

    useMapEvents({
      click(e) {
        setMarkerPosition(e.latlng);
        onLocationSelect(e.latlng);
      },
    });

    return markerPosition === null ? null : (
      <Marker position={markerPosition}></Marker>
    )
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
      },
      (err) => {
        console.log(err);
      }
    );
  }, []);

  return (
    <MapContainer
      center={position || [45.815, 15.9819]}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker onLocationSelect={onLocationSelect} />
      {/* <Marker position={position}>
        <Popup>You are here</Popup>
      </Marker> */}
    </MapContainer>
  );
}

export default MapComponent;
