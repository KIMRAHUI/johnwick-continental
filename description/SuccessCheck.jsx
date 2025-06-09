import './SuccessCheck.css';
import goldCoin from '../assets/gold-coin.png'; // ✅ 금화 이미지 import

// ✅ 예약 완료 성공 시 금화 아이콘을 표시하는 컴포넌트
function SuccessCheck() {
  return (
    <div className="success-check">
      {/* ✅ 원형 테두리 안에 금화 이미지 출력 */}
      <div className="coin-circle">
        <img src={goldCoin} alt="Gold Coin" className="coin-img" />
      </div>
    </div>
  );
}

export default SuccessCheck;
