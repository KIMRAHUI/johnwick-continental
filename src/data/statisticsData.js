
const darkWickColors = {
  red: '#e63946',
  deepRed: '#6a040f',
  darkGray: '#1a1a1a',
  gray: '#444',
  navy: '#003049',
  olive: '#283618',
  wine: '#7b2d26',
  slate: '#2b2d42',
  silver: '#8d99ae',
};

// 객실별 예약률 - Bar 그래프용
export const roomBookingData = {
  labels: ['디럭스룸', '스위트룸', '킬러스위트룸', '비밀오피스'],
  datasets: [
    {
      label: '예약 수',
      data: [40, 25, 15, 20],
      backgroundColor: [
        darkWickColors.red,
        darkWickColors.wine,
        darkWickColors.deepRed,
        darkWickColors.olive,
      ],
    },
  ],
};

// 시설물 이용 통계 - Doughnut 그래프용
export const facilityUsageData = {
  labels: ['킬러스위트룸', '트레이닝센터', '바', '연회장'],
  datasets: [
    {
      label: '이용 비율',
      data: [35, 30, 20, 15],
      backgroundColor: [
        darkWickColors.deepRed,
        darkWickColors.navy,
        darkWickColors.red,
        darkWickColors.gray,
      ],
    },
  ],
};

// 도시별 현상금 지명 수 - Doughnut 그래프용
export const bountyByCityData = {
  labels: ['서울', '부산', '뉴욕', '파리'],
  datasets: [
    {
      label: '현상금 지명 수',
      data: [50, 30, 40, 20],
      backgroundColor: [
        darkWickColors.red,
        darkWickColors.slate,
        darkWickColors.deepRed,
        darkWickColors.silver,
      ],
    },
  ],
};

// 고객 유형 - Pie 그래프용
export const guestTypeData = {
  labels: ['암살자', '중개인', '보호 대상'],
  datasets: [
    {
      label: '고객 비율',
      data: [60, 25, 15],
      backgroundColor: [
        darkWickColors.red,
        darkWickColors.olive,
        darkWickColors.navy,
      ],
    },
  ],
};
