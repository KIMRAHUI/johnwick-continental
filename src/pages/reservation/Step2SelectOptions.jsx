import { useNavigate, useLocation } from 'react-router-dom';
import { useState,useEffect } from 'react';
import './Step2SelectOptions.css';
import SecretCodeModal from '../../components/SecretCodeModal';

function Step2SelectOptions() {
  const navigate = useNavigate();
  const location = useLocation();

    useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [])

  const selectedRoom = location.state?.selectedRoom || '';
  const pricePerNight = location.state?.pricePerNight || 0;
  const availableRooms = location.state?.availableRooms || 1;
  const maxPeople = location.state?.maxPeople || 1; 

  const [options, setOptions] = useState({
    bar: false,
    armory: false,
    training: false,
    lounge: false,
    office: false,
    suite: false,
  });

  const [showSecretModal, setShowSecretModal] = useState(false);
  const [pendingSecureKey, setPendingSecureKey] = useState(null);

  const optionDetails = [
    { key: 'bar', label: '바 라운지 이용', price: 5 },
    { key: 'armory', label: '무기고 이용', price: 7 },
    { key: 'training', label: '트레이닝 센터', price: 9, secure: true },
    { key: 'lounge', label: '공용 라운지 이용', price: 4 },
    { key: 'office', label: '프라이빗 오피스', price: 12, secure: true },
    { key: 'suite', label: '킬러 스위트룸', price: 20, secure: true },
  ];

  const handleToggle = (key, secure) => {
    if (secure && !options[key]) {
      setPendingSecureKey(key);
      setShowSecretModal(true);
    } else {
      setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
    }
  };

  const handleSecretSuccess = () => {
    setOptions((prev) => ({ ...prev, [pendingSecureKey]: true }));
    setPendingSecureKey(null);
    setShowSecretModal(false);
  };

  const getTotalExtra = () => {
    return optionDetails.reduce((sum, opt) => {
      return options[opt.key] ? sum + opt.price : sum;
    }, 0);
  };

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

  const handleBack = () => {
    navigate('/reservation/step1');
  };

  return (
    <section className="step2-options">
      <h2>Step 2: 추가 옵션 선택</h2>
      <p>추가로 이용하실 서비스를 선택해 주세요.</p>

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

      <div className="summary-box">
        <p><strong>선택한 객실:</strong> {selectedRoom || '선택 없음'}</p>
        <p><strong>기본 객실 요금:</strong> {pricePerNight} 금화 / 1박</p>
        <p><strong>추가 옵션 요금:</strong> {getTotalExtra()} 금화</p>
        <p><strong>합계 예상:</strong> {(pricePerNight + getTotalExtra())} 금화 / 1박</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
        <button onClick={handleBack} className="next-button">이전으로</button>
        <button onClick={handleNext} className="next-button">다음 단계로</button>
      </div>

      {showSecretModal && (
        <SecretCodeModal
          correctCode="JW2025"
          onClose={() => setShowSecretModal(false)}
          onSuccess={handleSecretSuccess}
        />
      )}
    </section>
  );
}

export default Step2SelectOptions;
