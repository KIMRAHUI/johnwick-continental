import './Hero.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  Bar,
  Doughnut,
  Pie,
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

import {
  roomBookingData,
  facilityUsageData,
  bountyByCityData,
  guestTypeData,
} from '../data/statisticsData';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

function Hero() {
  const navigate = useNavigate();
  const [selectedChart, setSelectedChart] = useState('room');

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <>
      {/* 상단 히어로 배경 영역 */}
      <section className="hero">
        <div className="hero-content">
          <h1>The Continental</h1>
          <p>오직 금화로만 입장 가능한 킬러들의 마지막 안식처</p>
          <button className="hero-link" onClick={() => navigate('/reservation/step1')}>
            예약하기
          </button>
        </div>
      </section>

      {/* 세계관 통계 그래프 섹션 */}
      <section className="chart-section">
        <h2 className="chart-title">세계관 통계 정보</h2>
        <div className="chart-tabs">
          <button onClick={() => setSelectedChart('room')}>🧨 객실 예약률</button>
          <button onClick={() => setSelectedChart('facility')}>🎯 시설물 통계</button>
          <button onClick={() => setSelectedChart('bounty')}>🔫 도시별 현상금</button>
          <button onClick={() => setSelectedChart('guest')}>🩸 고객 유형</button>
        </div>
        <div className="chart-display">
          <div className="chart-wrapper">
            {selectedChart === 'room' && <Bar data={roomBookingData} options={commonOptions} />}
            {selectedChart === 'facility' && <Doughnut data={facilityUsageData} options={commonOptions} />}
            {selectedChart === 'bounty' && <Doughnut data={bountyByCityData} options={commonOptions} />}
            {selectedChart === 'guest' && <Pie data={guestTypeData} options={commonOptions} />}
          </div>
        </div>
      </section>

      {/* 소개 카드 영역 */}
      <section className="glass-card-wrapper">
        <div className="glass-card">
          <div className="glass-section">
            <h2>호텔 소개</h2>
            <p>
              콘티넨탈 호텔은 킬러들을 위한 중립 지대입니다.<br />
              전 세계 지점 모두가 동일한 규칙과 품격을 유지하며,<br />
              금화로만 운영되고 모든 고객의 프라이버시를 보장합니다.
            </p>
          </div>

          <div className="glass-section">
            <h2>운영 철학</h2>
            <p>
              콘티넨탈은 단순한 숙소가 아닙니다.<br />
              의뢰, 정보, 무기 거래까지 가능한 종합 거점이며,<br />
              내부 질서와 신뢰를 최우선으로 운영됩니다.
            </p>
          </div>

          <div className="glass-section">
            <h2>보안 규정</h2>
            <p>
              호텔 내 모든 폭력은 금지되며 위반 시 강력한 제재가 따릅니다.<br />
              출입은 생체 인증과 토큰 기반으로 관리되며,<br />
              철저한 감시 시스템이 24시간 작동합니다.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Hero;
