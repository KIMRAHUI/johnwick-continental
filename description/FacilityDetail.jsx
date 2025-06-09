import { useParams, useNavigate } from 'react-router-dom';
import facilityData from '../data/facilityData'; // 시설 목록 더미 데이터
import { useEffect, useState, useMemo } from 'react';
import SecretCodeModal from '../components/SecretCodeModal'; // 🔐 요원용 코드 입력 모달
import './FacilityDetail.css';

function FacilityDetail() {
  const { id } = useParams(); // URL 파라미터에서 시설 ID 추출
  const navigate = useNavigate();

  // 🔹 해당 ID의 시설 정보 찾기
  const facility = facilityData.find((f) => String(f.id) === id);

  // 🔹 모달, 인증 여부, 제한시간 등을 관리하는 state
  const [showModal, setShowModal] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [now, setNow] = useState(Date.now());

  // ✅ 킬러 스위트룸의 제한 시간 계산 (13시간 42분 25초)
  const restrictionUntil = useMemo(() => {
    return Date.now() + 13 * 60 * 60 * 1000 + 42 * 60 * 1000 + 25 * 1000;
  }, []);

  // 🔹 요건 판별
  const isKillerSuite = facility?.title === '킬러 스위트룸';
  const needsCode = ['킬러 스위트룸', '프라이빗 오피스', '트레이닝 센터'].includes(facility?.title);
  const isStillRestricted = isKillerSuite && now < restrictionUntil;

  // 🔹 페이지 로드시 스크롤 초기화 + 시간 갱신 인터벌 설정
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // ⏱ 남은 시간 포맷 (hh:mm:ss)
  const formatTime = (ms) => {
    const totalSec = Math.floor(ms / 1000);
    const h = String(Math.floor(totalSec / 3600)).padStart(2, '0');
    const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
    const s = String(totalSec % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  // 🔸 예약 버튼 클릭 시 처리
  const handleReserveClick = () => {
    // 요원 전용 시설이고 아직 인증되지 않았다면 → 모달 열기
    if (needsCode && !isAuthorized) {
      setShowModal(true);
    } else {
      // 일반 시설이거나 이미 인증된 경우 → 긴급 결제 페이지 이동
      navigate('/emergency-payment', {
        state: {
          selectedFacility: facility.title,
          price: facility.price || 0,
          type: 'service',
        },
      });
    }
  };

  // 🔸 인증 성공 시 실행
  const handleSuccess = () => {
    setIsAuthorized(true);
    setShowModal(false);
    navigate('/emergency-payment', {
      state: {
        selectedFacility: facility.title,
        price: facility.price || 0,
        type: 'service',
      },
    });
  };

  // 잘못된 ID로 접근한 경우
  if (!facility) return <p>해당 시설을 찾을 수 없습니다.</p>;

  return (
    <section className="facility-detail">
      {/* 🔹 이미지 및 뒤로가기 */}
      <div className="image-wrapper">
        <button className="back-top-btn" onClick={() => navigate('/facilities')}>
          ← 목록으로
        </button>

        <img
          src={facility.image}
          alt={facility.title}
          className="facility-detail-image"
        />
      </div>

      {/* 🔹 상세 정보 영역 */}
      <div className="detail-content">
        <h2>{facility.title}</h2>
        <p>{facility.description}</p>

        {/* 🔸 킬러 스위트룸 제한 시간 남은 경우 */}
        {isKillerSuite && isStillRestricted ? (
          <p className="reservation-info">
            ⚠️ 현재 이용 중입니다. <br />
            <strong>{formatTime(restrictionUntil - now)}</strong> 후 예약 가능합니다.
          </p>
        ) : needsCode ? (
          // 🔸 코드 인증이 필요한 경우
          <button className="pay-btn" onClick={handleReserveClick}>
            예약 및 결제하기
          </button>
        ) : (
          // 🔸 전화 예약만 가능한 일반 시설
          <span className="reservation-info">* 전화 예약만 가능합니다.</span>
        )}
      </div>

      {/* 🔹 요원 코드 입력 모달 */}
      {showModal && (
        <SecretCodeModal
          correctCode="JW2025"
          onClose={() => setShowModal(false)}
          onSuccess={handleSuccess}
        />
      )}
    </section>
  );
}

export default FacilityDetail;
