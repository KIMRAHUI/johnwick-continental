import './SuccessCheck.css';
import goldCoin from '../assets/gold-coin.png'; // 금화 이미지

function SuccessCheck() {
  return (
    <div className="success-check">
      <div className="coin-circle">
        <img src={goldCoin} alt="Gold Coin" className="coin-img" />
      </div>
    </div>
  );
}

export default SuccessCheck;
