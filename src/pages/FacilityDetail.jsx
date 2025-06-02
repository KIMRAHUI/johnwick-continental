import { useParams, useNavigate } from 'react-router-dom';
import facilityData from '../data/facilityData';
import { useEffect, useState, useMemo } from 'react';
import SecretCodeModal from '../components/SecretCodeModal';
import './FacilityDetail.css';

function FacilityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const facility = facilityData.find((f) => String(f.id) === id);
  const [showModal, setShowModal] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [now, setNow] = useState(Date.now());

  // ✅ 킬러스위트 제한 시간: 최초 페이지 로딩 시 고정
  const restrictionUntil = useMemo(() => {
    return Date.now() + 13 * 60 * 60 * 1000 + 42 * 60 * 1000 + 25 * 1000;
  }, []);

  const isKillerSuite = facility?.title === '킬러 스위트룸';
  const needsCode = ['킬러 스위트룸', '프라이빗 오피스', '트레이닝 센터'].includes(facility?.title);
  const isStillRestricted = isKillerSuite && now < restrictionUntil;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (ms) => {
    const totalSec = Math.floor(ms / 1000);
    const h = String(Math.floor(totalSec / 3600)).padStart(2, '0');
    const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
    const s = String(totalSec % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const handleReserveClick = () => {
    if (needsCode && !isAuthorized) {
      setShowModal(true);
    } else {
      navigate('/emergency-payment', {
        state: {
          selectedFacility: facility.title,
          price: facility.price || 0,
          type: 'service',
        },
      });
    }
  };

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

  if (!facility) return <p>해당 시설을 찾을 수 없습니다.</p>;

  return (
    <section className="facility-detail">
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

      <div className="detail-content">
        <h2>{facility.title}</h2>
        <p>{facility.description}</p>

        {isKillerSuite && isStillRestricted ? (
          <p className="reservation-info">
            ⚠️ 현재 이용 중입니다. <br />
            <strong>{formatTime(restrictionUntil - now)}</strong> 후 예약 가능합니다.
          </p>
        ) : needsCode ? (
          <button className="pay-btn" onClick={handleReserveClick}>
            예약 및 결제하기
          </button>
        ) : (
          <span className="reservation-info">* 전화 예약만 가능합니다.</span>
        )}
      </div>

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
