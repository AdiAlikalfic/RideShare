import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import { useEffect, useState, useRef } from "react";
import L, { routing } from "leaflet";
import "./Map.css"
import "leaflet-routing-machine"

//custom markers
const pickupIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const destinationIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapComponent({onLocationSelect, onPickupDetected, pickup, destination, onDistanceCalculated}) {
  const [position, setPosition] = useState(null);

  function LocationMarker({onLocationSelect}) {
    const [markerPosition, setMarkerPosition] = useState(null);

    useMapEvents({
      click(e) {
        onLocationSelect(e.latlng)
        // setMarkerPosition(e.latlng);
        // onLocationSelect(e.latlng);
      },
    });

    return null;

    // return markerPosition === null ? null : (
    //   <Marker position={markerPosition} icon={destinationIcon}>
    //     <Popup>Destination</Popup>
    //   </Marker>
    // )
  }

  function Routing({pickup, destination, onDistanceCalculated}) {
    const map = useMap();
    const routingRef = useRef(null);

    useEffect(() => {
      if (!pickup || !destination) return;

      if (routingRef.current) {
        map.removeControl(routingRef.current)
      }

      const routingControl = L.Routing.control({
        waypoints: [
          L.latLng(pickup.lat, pickup.lng),
          L.latLng(destination.lat, destination.lng)
        ],
        lineOptions: {
          styles: [{ color: "#2563eb", weight: 5}]
        },
        routeWhileDragging: false,
        draggableWaypoints: false,
        addWaypoints: false,
        createMarker: () => null,

        itinerary: {
          show: false
        }

      }).addTo(map);

      routingControl.on("routesfound", function (e) {
        const route = e.routes[0]

        const distance = route.summary.totalDistance;

        onDistanceCalculated(distance);

        const bounds = L.latLngBounds(route.coordinates);
        map.fitBounds(bounds, {padding: [30, 30]});
      });
      routingRef.current = routingControl;

      return () => map.removeControl(routingControl);

    }, [pickup, destination, map]);

    return null;
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        }
        setPosition([coords.lat, coords.lng]);
        onPickupDetected(coords);
      },
      (err) => {
        console.log(err);
      }
    ); 
  }, []);

  if (!position) {
  return <p>Detecting your location...</p>;
}

  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker onLocationSelect={onLocationSelect} />
      {pickup && (
        <Marker position={[pickup.lat, pickup.lng]} icon={pickupIcon}>
          <Popup>Your location</Popup>
        </Marker>
      )}
      {destination && (
        <Marker position={[destination.lat, destination.lng]} icon={destinationIcon} >
          <Popup>Destination</Popup>
        </Marker>
      )
        }
      {pickup && destination && (
        <Routing pickup={pickup} destination={destination} onDistanceCalculated={onDistanceCalculated} />
      )}
    </MapContainer>
  );
}

export default MapComponent;
