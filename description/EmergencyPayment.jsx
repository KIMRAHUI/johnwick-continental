import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './EmergencyPayment.css';

function EmergencyPayment() {
  const location = useLocation(); // 🔹 이전 페이지에서 전달된 상태(state) 값 접근
  const navigate = useNavigate();

  // 🔹 전달된 예약 관련 정보 디스트럭처링
  const { selectedFacility, price, type } = location.state || {};

  // 🔹 결제 정보 및 상태 관리용 state
  const [cardNumber, setCardNumber] = useState('');
  const [cvc, setCvc] = useState('');
  const [success, setSuccess] = useState(false);
  const [reservationCode, setReservationCode] = useState('');

  // 🔹 오늘 날짜 YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];

  // 🔹 페이지 로드시 최상단으로 스크롤 이동
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // 🔹 결제 처리 함수
  const handlePayment = () => {
    // 간단한 유효성 검사
    if (cardNumber.length < 8 || cvc.length < 3) {
      alert('카드번호와 CVC를 정확히 입력해주세요.');
      return;
    }

    // 예약번호 생성 (예: EMG-20250609-3XFT)
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    setReservationCode(`EMG-${today.replace(/-/g, '')}-${rand}`);

    // 결제 성공 처리
    setSuccess(true);
  };

  // 🔹 잘못된 접근 방지 (선택된 시설이 없으면)
  if (!selectedFacility) {
    return <p style={{ color: 'white', padding: '2rem' }}>잘못된 접근입니다.</p>;
  }

  return (
    <section className="emergency-payment">
      <h2>긴급 결제</h2>

      {!success ? (
        <>
          {/* 🔸 결제 정보 요약 표시 */}
          <div className="info-box">
            <p><strong>이용 시설:</strong> {selectedFacility}</p>
            <p><strong>이용 구분:</strong> {type === 'service' ? '서비스' : '기타'}</p>
            <p><strong>결제 금액:</strong> {price} 금화</p>
          </div>

          {/* 🔸 카드 결제 정보 입력 폼 */}
          <form className="payment-form" onSubmit={(e) => e.preventDefault()}>
            <label>
              카드 번호
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="예: 1234 5678 9012 3456"
              />
            </label>

            <label>
              CVC
              <input
                type="text"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                placeholder="예: 123"
              />
            </label>

            <button className="pay-btn" onClick={handlePayment}>결제하기</button>
          </form>

          {/* 🔸 안내 문구 */}
          <p className="notice-text">
            ⚠️ 본 예약은 <strong>당일 긴급 이용만 가능</strong>하며, <br />
            24시간 초과 사용 시 <strong>컨시어지 데스크로 문의</strong>해 주세요.
          </p>
        </>
      ) : (
        // 🔸 결제 완료 화면
        <div className="success-box">
          <h3>✅ 결제가 완료되었습니다.</h3>
          <p>예약 번호: <strong>{reservationCode}</strong></p>
          <button className="pay-btn" onClick={() => navigate('/')}>홈으로 돌아가기</button>
        </div>
      )}
    </section>
  );
}

export default EmergencyPayment;
