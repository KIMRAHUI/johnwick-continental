import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import facilityData from '../data/facilityData'; // 🔸 시설 정보 데이터 (JSON or JS 배열)
import './FacilityList.css';
import SecretCodeModal from '../components/SecretCodeModal'; // 🔐 비밀 코드 입력 모달

function FacilityList() {
  const navigate = useNavigate();

  // 🔹 모달 표시 여부 및 선택된 요원 전용 시설 ID
  const [showModal, setShowModal] = useState(false);
  const [targetId, setTargetId] = useState(null);

  // 🔸 카드 클릭 시 처리
  const handleCardClick = (facility) => {
    if (facility.isSecret) {
      // 요원 전용 시설이면 모달 띄우기
      setTargetId(facility.id);
      setShowModal(true);
    } else {
      // 일반 시설이면 바로 상세페이지 이동
      navigate(`/facilities/${facility.id}`);
    }
  };

  return (
    <section className="facility-section">
      <h2>Facilities</h2>

      {/* 🔹 시설 카드 그리드 출력 */}
      <div className="facility-grid">
        {facilityData.map((facility) => (
          <div
            key={facility.id}
            className="facility-card"
            onClick={() => handleCardClick(facility)}
          >
            <img src={facility.image} alt={facility.title} />
            <h3>{facility.title}</h3>
            <p>{facility.description}</p>
          </div>
        ))}
      </div>

      {/* 🔐 요원 전용 시설 접근 시 모달 팝업 */}
      {showModal && (
        <SecretCodeModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            // 인증 성공 시 해당 시설 상세 페이지로 이동
            navigate(`/facilities/${targetId}`);
          }}
        />
      )}
    </section>
  );
}

export default FacilityList;
