// 📦 React Router 및 React 훅 import
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Step2SelectOptions.css';
import SecretCodeModal from '../../components/SecretCodeModal';

function Step2SelectOptions() {
  const navigate = useNavigate();
  const location = useLocation();

  // ⬆️ 페이지 로드시 최상단으로 스크롤 이동
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // 📥 Step1에서 전달받은 예약 관련 정보
  const selectedRoom = location.state?.selectedRoom || '';
  const pricePerNight = location.state?.pricePerNight || 0;
  const availableRooms = location.state?.availableRooms || 1;
  const maxPeople = location.state?.maxPeople || 1;

  // ✅ 옵션 상태 관리
  const [options, setOptions] = useState({
    bar: false,
    armory: false,
    training: false,
    lounge: false,
    office: false,
    suite: false,
  });

  // 🔐 비밀 옵션 선택 관련 상태
  const [showSecretModal, setShowSecretModal] = useState(false);
  const [pendingSecureKey, setPendingSecureKey] = useState(null);

  // 📝 선택 가능한 옵션 정의 (일부는 secure 처리)
  const optionDetails = [
    { key: 'bar', label: '바 라운지 이용', price: 5 },
    { key: 'armory', label: '무기고 이용', price: 7 },
    { key: 'training', label: '트레이닝 센터', price: 9, secure: true },
    { key: 'lounge', label: '공용 라운지 이용', price: 4 },
    { key: 'office', label: '프라이빗 오피스', price: 12, secure: true },
    { key: 'suite', label: '킬러 스위트룸', price: 20, secure: true },
  ];

  // ✅ 옵션 클릭 시 처리
  const handleToggle = (key, secure) => {
    if (secure && !options[key]) {
      // 🔐 비밀 코드가 필요한 옵션이면 모달 열기
      setPendingSecureKey(key);
      setShowSecretModal(true);
    } else {
      // 일반 옵션은 바로 toggle
      setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
    }
  };

  // 🔓 SecretCodeModal 성공 시 옵션 활성화
  const handleSecretSuccess = () => {
    setOptions((prev) => ({ ...prev, [pendingSecureKey]: true }));
    setPendingSecureKey(null);
    setShowSecretModal(false);
  };

  // 💰 선택한 옵션들의 총 금액 계산
  const getTotalExtra = () => {
    return optionDetails.reduce((sum, opt) => {
      return options[opt.key] ? sum + opt.price : sum;
    }, 0);
  };

  // ▶️ 다음 단계로 이동 (Step3)
  const handleNext = () => {
    navigate('/reservation/step3', {
      state: {
        selectedRoom,
        pricePerNight,
        availableRooms,
        maxPeople,
        selectedOptions: options,
        extraCost: getTotalExtra(),
      },
    });
  };

  // ◀️ 이전 단계로 돌아가기
  const handleBack = () => {
    navigate('/reservation/step1');
  };

  return (
    <section className="step2-options">
      {/* 🧭 타이틀 및 설명 */}
      <h2>Step 2: 추가 옵션 선택</h2>
      <p>추가로 이용하실 서비스를 선택해 주세요.</p>

      {/* ✅ 체크박스 옵션 리스트 */}
      <div className="option-list grid-layout">
        {optionDetails.map((opt) => (
          <label key={opt.key} className="option-item">
            <input
              type="checkbox"
              checked={options[opt.key]}
              onChange={() => handleToggle(opt.key, opt.secure)}
            />
            {opt.label} (+{opt.price} 금화)
          </label>
        ))}
      </div>

      {/* 💵 요금 요약 박스 */}
      <div className="summary-box">
        <p><strong>선택한 객실:</strong> {selectedRoom || '선택 없음'}</p>
        <p><strong>기본 객실 요금:</strong> {pricePerNight} 금화 / 1박</p>
        <p><strong>추가 옵션 요금:</strong> {getTotalExtra()} 금화</p>
        <p><strong>합계 예상:</strong> {(pricePerNight + getTotalExtra())} 금화 / 1박</p>
      </div>

      {/* 🔄 네비게이션 버튼 */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
        <button onClick={handleBack} className="next-button">이전으로</button>
        <button onClick={handleNext} className="next-button">다음 단계로</button>
      </div>

      {/* 🔐 비밀 옵션 선택 시 표시되는 모달 */}
      {showSecretModal && (
        <SecretCodeModal
          correctCode="JW2025" // 인증코드
          onClose={() => setShowSecretModal(false)}
          onSuccess={handleSecretSuccess}
        />
      )}
    </section>
  );
}

export default Step2SelectOptions;
