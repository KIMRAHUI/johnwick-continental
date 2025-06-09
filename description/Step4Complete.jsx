import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import './Step4Complete.css';
import SuccessCheck from '../../components/SuccessCheck';

function Step4Complete() {
  const location = useLocation();
  const navigate = useNavigate();

  // 페이지 로드시 스크롤을 최상단으로 부드럽게 이동
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // 이전 단계에서 전달받은 예약 정보 추출
  const {
    selectedRoom,
    selectedOptions,
    pricePerNight,
    extraCost,
    checkIn,
    checkOut,
    adults,
    children,
    rooms,
    totalNights,
  } = location.state || {};

  // 예약 정보가 유실되었을 경우 안내 메시지 출력
  if (!selectedRoom || !checkIn || !checkOut) {
    return (
      <section className="step4-complete">
        <h2>예약 정보가 없습니다</h2>
        <p>잘못된 접근이거나 예약 정보가 유실되었습니다.</p>
        <button className="next-button" onClick={() => navigate('/')}>
          홈으로 돌아가기
        </button>
      </section>
    );
  }

  // 선택된 옵션을 한글 라벨로 변환
  const selectedOptionLabels = Object.entries(selectedOptions || {})
    .filter(([_, checked]) => checked)
    .map(([key]) => {
      if (key === 'bar') return '바 라운지';
      if (key === 'armory') return '무기고';
      if (key === 'training') return '트레이닝 센터';
      if (key === 'lounge') return '공용 라운지';
      if (key === 'office') return '프라이빗 오피스';
      if (key === 'suite') return '킬러 스위트룸';
      return key;
    });

  // 총 결제 금화 계산 (기본 요금 + 옵션 요금) × 숙박일수 × 객실 수
  const totalPrice = (pricePerNight + extraCost) * totalNights * rooms;

  // 예약 번호 생성 함수 (날짜 + 랜덤코드 조합)
  const generateCode = () => {
    const date = new Date();
    const ymd = date.toISOString().slice(0, 10).replace(/-/g, '');
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `CONT-${ymd}-${rand}`;
  };

  // 실제 예약 번호 생성
  const reservationCode = generateCode();

  return (
    <section className="step4-complete">
      <h2>Step 4: 예약 완료</h2>

      {/* 성공 애니메이션 컴포넌트 */}
      <SuccessCheck />

      {/* 예약 번호 표시 */}
      <div className="reservation-code">예약 번호: {reservationCode}</div>

      {/* 예약 요약 정보 표시 */}
      <div className="summary-box">
        <div className="summary-row"><strong>예약 객실:</strong> {selectedRoom}</div>
        <div className="summary-row"><strong>체크인:</strong> {checkIn}</div>
        <div className="summary-row"><strong>체크아웃:</strong> {checkOut}</div>
        <div className="summary-row"><strong>숙박일수:</strong> {totalNights}박</div>
        <div className="summary-row"><strong>객실 수:</strong> {rooms}개</div>
        <div className="summary-row">
          <strong>인원:</strong> 성인 {adults}명
          {children && parseInt(children) > 0 && `, 어린이 ${children}명`}
        </div>
        <div className="summary-row"><strong>이용 서비스:</strong> {selectedOptionLabels.length > 0 ? selectedOptionLabels.join(', ') : '없음'}</div>
        <div className="summary-row"><strong>1박당 객실 요금:</strong> {pricePerNight} 금화</div>
        <div className="summary-row"><strong>옵션 요금:</strong> {extraCost} 금화 / 1박</div>
        <div className="summary-row total"><strong>총 결제 금화:</strong> {totalPrice} 금화</div>
      </div>

      {/* 이동 버튼들 */}
      <div className="form-buttons">
        <button
          className="next-button"
          onClick={() => navigate('/reservation/step3', { state: location.state })}
        >
          이전으로
        </button>
        <button className="next-button" onClick={() => navigate('/')}>
          홈으로 돌아가기
        </button>
      </div>
    </section>
  );
}

export default Step4Complete;
