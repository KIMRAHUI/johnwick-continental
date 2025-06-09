import { useState } from 'react';
import './SecretCodeModal.css';

function SecretCodeModal({ onClose, onSuccess }) {
  // ✅ 입력된 코드 상태값
  const [code, setCode] = useState('');
  // ✅ 오류 메시지 상태값
  const [error, setError] = useState('');

  // ✅ 코드 검증 함수
  const handleSubmit = () => {
    const validCode = 'continental42'; // 🔐 사전에 정해진 요원 전용 코드
    if (code === validCode) {
      setError('');
      onSuccess(); // 성공 시 상위 컴포넌트에서 제공한 콜백 실행
    } else {
      setError('❌ 접근 코드가 일치하지 않습니다.'); // 실패 시 오류 메시지 표시
    }
  };

  return (
    <div className="modal-overlay">
      <div className="secret-modal">
        {/* ✅ 모달 제목 */}
        <h2>🔐 전용 코드 입력</h2>
        <p>이 시설은 요원 전용입니다. 접속 코드를 입력하세요.</p>

        {/* ✅ 비밀번호 입력 필드 */}
        <input
          type="password"
          placeholder="접속 코드"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        {/* ✅ 오류 메시지 표시 */}
        {error && <p className="error">{error}</p>}

        {/* ✅ 하단 버튼: 닫기 / 입장 */}
        <div className="modal-actions">
          <button onClick={onClose}>닫기</button>
          <button onClick={handleSubmit}>입장</button>
        </div>
      </div>
    </div>
  );
}

export default SecretCodeModal;
