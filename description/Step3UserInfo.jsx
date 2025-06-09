// 📦 필요한 라이브러리 및 스타일 import
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Step3UserInfo.css";

function Step3UserInfo() {
  const navigate = useNavigate();
  const location = useLocation();

  // ⬆️ 페이지 진입 시 맨 위로 스크롤
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // 📥 이전 단계에서 전달받은 예약 정보들
  const selectedRoom = location.state?.selectedRoom || "";
  const pricePerNight = location.state?.pricePerNight || 0;
  const availableRooms = location.state?.availableRooms || 1;
  const maxPeople = location.state?.maxPeople || 1;
  const selectedOptions = location.state?.selectedOptions || {};
  const extraCost = location.state?.extraCost || 0;

  // ✅ 사용자 입력값 상태 초기화
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState("");
  const [children, setChildren] = useState("");
  const [rooms, setRooms] = useState("");
  const [totalNights, setTotalNights] = useState(0); // 숙박 일수 계산용

  // 🕒 체크인/아웃 날짜로 숙박일수 계산
  useEffect(() => {
    if (checkIn && checkOut) {
      const inDate = new Date(checkIn);
      const outDate = new Date(checkOut);
      const diff = (outDate - inDate) / (1000 * 60 * 60 * 24);
      setTotalNights(diff > 0 ? diff : 0);
    }
  }, [checkIn, checkOut]);

  // 👥 인원 수 및 제한 계산
  const totalGuests = parseInt(adults || 0) + parseInt(children || 0);
  const roomCount = rooms ? parseInt(rooms) : 1;
  const totalCapacity = roomCount * maxPeople;
  const isGuestOverLimit = totalGuests > totalCapacity;

  // ▶️ 예약 최종 단계로 이동
  const handleNext = () => {
    // 필수 입력 확인 및 조건 검증
    if (
      !checkIn ||
      !checkOut ||
      !adults ||
      !rooms ||
      totalNights < 1 ||
      isGuestOverLimit
    ) {
      return;
    }

    // ✅ 다음 단계로 이동하면서 입력 정보 전달
    navigate("/reservation/step4", {
      state: {
        selectedRoom,
        pricePerNight,
        availableRooms,
        maxPeople,
        selectedOptions,
        extraCost,
        checkIn,
        checkOut,
        adults,
        children,
        rooms,
        totalNights,
      },
    });
  };

  // ◀️ 이전 단계로 돌아가기
  const handleBack = () => {
    navigate("/reservation/step2", { state: location.state });
  };

  // 📝 선택된 서비스명을 한글로 매핑하여 표시
  const selectedServiceNames = Object.entries(selectedOptions)
    .filter(([_, value]) => value)
    .map(([key]) => {
      switch (key) {
        case "bar": return "바 라운지";
        case "armory": return "무기고";
        case "training": return "트레이닝 센터";
        case "lounge": return "공용 라운지";
        case "office": return "프라이빗 오피스";
        case "suite": return "킬러 스위트룸";
        default: return key;
      }
    });

  return (
    <section className="step3-user-info">
      <h2>Step 3: 예약 정보 입력</h2>

      {/* ✅ 사용자 입력 폼 */}
      <form className="user-info-form">
        {/* 체크인 날짜 입력 */}
        <label>
          체크인 날짜
          <input
            type="date"
            value={checkIn}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setCheckIn(e.target.value)}
            required
          />
        </label>

        {/* 체크아웃 날짜 입력 (체크인 후 최소 1일) */}
        <label>
          체크아웃 날짜
          <input
            type="date"
            value={checkOut}
            min={
              checkIn
                ? new Date(new Date(checkIn).getTime() + 24 * 60 * 60 * 1000)
                    .toISOString()
                    .split("T")[0]
                : ''
            }
            onChange={(e) => setCheckOut(e.target.value)}
            required
            disabled={!checkIn}
          />
        </label>

        {/* 성인 수 입력 */}
        <label>
          성인
          <input
            type="number"
            value={adults}
            onChange={(e) =>
              setAdults(e.target.value.replace(/^0+(?!$)/, ""))
            }
            min="1"
            placeholder="예: 2명"
            required
          />
        </label>

        {/* 어린이 수 입력 (성인 입력 시에만 표시) */}
        {parseInt(adults || 0) >= 1 && (
          <label>
            어린이(만 12세 미만)
            <input
              type="number"
              value={children}
              onChange={(e) =>
                setChildren(e.target.value.replace(/^0+(?!$)/, ""))
              }
              min="0"
              placeholder="예: 1명"
            />
          </label>
        )}

        {/* 객실 수 입력 (예약 가능 수 이하로 제한) */}
        <label>
          객실 수 (예약 가능 {availableRooms}개)
          <input
            type="number"
            value={rooms}
            onChange={(e) => {
              let value = parseInt(e.target.value.replace(/^0+(?!$)/, "")) || "";
              if (value <= availableRooms) setRooms(value);
            }}
            min="1"
            max={availableRooms}
            placeholder="예: 1"
            required
          />
        </label>

        {/* 인원 초과 경고 메시지 */}
        {isGuestOverLimit && (
          <p className="warning-text">
            🚫 예약 가능한 최대 인원을 초과했습니다.
          </p>
        )}

        {/* 💰 예약 정보 요약 */}
        <div className="info-summary">
          <p><strong>선택한 객실:</strong> {selectedRoom}</p>
          <p><strong>이용 서비스:</strong> {selectedServiceNames.length > 0 ? selectedServiceNames.join(", ") : "없음"}</p>
          <p><strong>최대 이용 인원:</strong> {maxPeople}명</p>
          <p className="bg"><strong>예상 총 금화:</strong> {(pricePerNight + extraCost) * totalNights} 금화</p>
        </div>

        {/* ⬅️➡️ 네비게이션 버튼 */}
        <div className="form-buttons">
          <button type="button" className="next-button" onClick={handleBack}>
            이전으로
          </button>
          <button type="button" className="next-button" onClick={handleNext}>
            예약 완료
          </button>
        </div>
      </form>
    </section>
  );
}

export default Step3UserInfo;
