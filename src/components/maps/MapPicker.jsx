import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function ClickToPick({ onPick }) {
  useMapEvents({
    click(e) {
      onPick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export default function MapPicker({ value, onChange }) {
  // fallback center (Matara, Sri Lanka) — change if you want
  const center =
    value?.lat && value?.lng ? [value.lat, value.lng] : [5.9496, 80.5353];

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-border">
      <div className="h-[280px] w-full">
        <MapContainer center={center} zoom={13} className="h-full w-full">
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <ClickToPick onPick={onChange} />

          {value?.lat && value?.lng && (
            <Marker position={[value.lat, value.lng]} />
          )}
        </MapContainer>
      </div>

      <div className="p-3 text-xs text-muted-foreground">
        Click on the map to select your exact location.
      </div>
    </div>
  );
}