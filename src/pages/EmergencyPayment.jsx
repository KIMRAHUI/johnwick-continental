import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './EmergencyPayment.css';

function EmergencyPayment() {
  const location = useLocation();
  const navigate = useNavigate();

  const { selectedFacility, price, type } = location.state || {};
  const [cardNumber, setCardNumber] = useState('');
  const [cvc, setCvc] = useState('');
  const [success, setSuccess] = useState(false);
  const [reservationCode, setReservationCode] = useState('');

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handlePayment = () => {
    if (cardNumber.length < 8 || cvc.length < 3) {
      alert('카드번호와 CVC를 정확히 입력해주세요.');
      return;
    }

    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    setReservationCode(`EMG-${today.replace(/-/g, '')}-${rand}`);
    setSuccess(true);
  };

  if (!selectedFacility) {
    return <p style={{ color: 'white', padding: '2rem' }}>잘못된 접근입니다.</p>;
  }

  return (
    <section className="emergency-payment">
      <h2>긴급 결제</h2>

      {!success ? (
        <>
          <div className="info-box">
            <p><strong>이용 시설:</strong> {selectedFacility}</p>
            <p><strong>이용 구분:</strong> {type === 'service' ? '서비스' : '기타'}</p>
            <p><strong>결제 금액:</strong> {price} 금화</p>
          </div>

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

          <p className="notice-text">
            ⚠️ 본 예약은 <strong>당일 긴급 이용만 가능</strong>하며, <br />
            24시간 초과 사용 시 <strong>컨시어지 데스크로 문의</strong>해 주세요.
          </p>
        </>
      ) : (
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
