import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useRef, useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import './Location.css';

// 🔴 호텔 위치 마커 아이콘 설정 (빨간색)
const hotelIcon = new L.Icon({
  iconUrl: '/marker-icon-red.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// 🔵 도망자 위치 마커 아이콘 설정 (파란색)
const blueIcon = new L.Icon({
  iconUrl: '/marker-icon-blue.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// 📍 주소 검색 컴포넌트
function AddressSearch({ mapRef }) {
  const handleSearch = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        const query = `${data.address}`;
        // 🔄 다음 주소 → OpenStreetMap 좌표 변환
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`)
          .then((res) => res.json())
          .then((result) => {
            if (result && result.length > 0) {
              const { lat, lon } = result[0];
              mapRef.current.setView([parseFloat(lat), parseFloat(lon)], 16); // 지도 이동
            } else {
              alert('❌ 위치를 찾을 수 없습니다.');
            }
          });
      },
    }).open();
  };

  return (
    <div className="search-bar">
      <button onClick={handleSearch}>주소 검색</button>
    </div>
  );
}

function Location() {
  const hotelPosition = [37.5665, 126.9780]; // 🏨 Continental 본점 위치 (서울 중심)
  const mapRef = useRef(); // 지도 객체 참조

  // 🦹‍♀️ 초기 도망자 리스트
  const initialFugitives = [
    { name: 'Cassian', bounty: '₩500,000,000', reason: '콘티넨탈 내 무단 공격', position: [37.5645, 126.9770] },
    { name: 'Ares', bounty: '₩350,000,000', reason: '하이테이블 금고 침입', position: [37.5678, 126.9825] },
    { name: "Santino D'Antonio", bounty: '₩800,000,000', reason: '신성한 계약 위반', position: [37.5655, 126.9760] },
  ];

  const [fugitives, setFugitives] = useState(initialFugitives);

  // ⏱️ 도망자 위치 실시간 갱신 (2초마다 좌표를 미세하게 변경)
  useEffect(() => {
    const interval = setInterval(() => {
      setFugitives((prev) =>
        prev.map((f) => {
          const latOffset = (Math.random() - 0.5) * 0.0002;
          const lngOffset = (Math.random() - 0.5) * 0.0002;
          return {
            ...f,
            position: [f.position[0] + latOffset, f.position[1] + lngOffset],
          };
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="location-page">
      {/* 📍 헤더 + 주소 검색 */}
      <div className="location-header">
        <h2>Location</h2>
        <AddressSearch mapRef={mapRef} />
      </div>

      {/* 🗺️ 지도 영역 */}
      <div className="map-wrapper">
        <MapContainer
          center={hotelPosition}
          zoom={15}
          scrollWheelZoom={false}
          className="leaflet-map"
          whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
        >
          {/* 🧱 지도 타일 로딩 */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {/* 🏨 호텔 마커 */}
          <Marker position={hotelPosition} icon={hotelIcon}>
            <Popup>
              Continental Hotel 본점<br />
              서울특별시 중구 무교로 1
            </Popup>
          </Marker>

          {/* 🦹 도망자 마커 목록 */}
          {fugitives.map((fugitive, index) => (
            <Marker key={index} position={fugitive.position} icon={blueIcon}>
              <Popup>
                <strong>{fugitive.name}</strong><br />
                현상금: {fugitive.bounty}<br />
                이유: {fugitive.reason}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* 🧭 텍스트 위치 정보 */}
      <div className="location-info">
        <h3>호텔 위치 안내</h3>
        <p>서울특별시 중구 무교로 1</p>
        <p>콘티넨탈 본점은 모든 킬러들에게 안전지대이자 출입 허가자만 접근 가능한 중립 지점입니다.</p>
      </div>
    </section>
  );
}

export default Location;
