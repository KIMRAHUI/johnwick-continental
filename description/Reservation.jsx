import { useNavigate } from 'react-router-dom';
import './Reservation.css';
import RoomCard from '../components/RoomCard';

// 🏨 객실 이미지 import
import deluxe from '../assets/deluxe.png';
import assassin from '../assets/assassin.png';
import blackroom from '../assets/blackroom.png';
import bunker from '../assets/bunker.png';
import penthouse from '../assets/penthouse.png';
import silentRoom from '../assets/silent-room.png';

function Reservation() {
  const navigate = useNavigate(); // 페이지 이동 훅

  // 🛏️ 객실 정보 배열
  const roomList = [
    {
      title: '디럭스 스위트',
      image: deluxe,
      price: 15, // 금화 단위
      maxPeople: 2,
      available: 3,
      description: '방음 설계와 신분 세탁 통로 연결\n프라이빗 욕실과 더블 침대가 제공, 지상 3층에 위치',
    },
    {
      title: '암살자 은신처',
      image: assassin,
      price: 20,
      maxPeople: 2,
      available: 2,
      description: '은밀한 이동 경로,\n 프라이빗 보안 시스템,\n트윈 침대가 제공,\n 무기 보관이 가능한 2층 구조',
    },
    {
      title: '블랙 룸',
      image: blackroom,
      price: 30,
      maxPeople: 2,
      available: 1,
      description: '하이테이블 VIP 전용의 독립 공간\n킹사이즈 침대와 최고급 욕실',
    },
    {
      title: '콘티넨탈 벙커',
      image: bunker,
      price: 25,
      maxPeople: 4,
      available: 2,
      description: '지하 금고와 연결된 보안형 객실\n이층 침대 2세트가 제공,\n 외부와 완전히 격리된 구조',
    },
    {
      title: '하이 테이블 펜트하우스',
      image: penthouse,
      price: 40,
      maxPeople: 4,
      available: 1,
      description: '최상층에 위치하여 멋진 도시 전경\n슈퍼 킹사이즈 베드\n 전용 자쿠지가 완비',
    },
    {
      title: '사일런트 쿼터스',
      image: silentRoom,
      price: 12,
      maxPeople: 1,
      available: 4,
      description: '접촉이 금지된 격리형 방음 객실\n단독 침대가 제공\n 단기 대기용으로 최적화',
    }
  ];

  // ▶️ 객실 선택 시 Step2로 이동 + 예약 정보 전달
  const handleSelect = (room) => {
    navigate('/reservation/step2', {
      state: {
        selectedRoom: room.title,
        pricePerNight: room.price,
        availableRooms: room.available,
        maxPeople: room.maxPeople,
      },
    });
  };

  return (
    <section className="reservation-page">
      {/* 🔰 헤더 영역 */}
      <div className="reservation-header">
        <h2>Room Reservation</h2>
      </div>

      {/* 📋 객실 리스트 */}
      <div className="room-list">
        {roomList.map((room) => (
          <RoomCard
            key={room.title}
            room={room}
            onSelect={() => handleSelect(room)} // 선택 핸들러 연결
          />
        ))}
      </div>
    </section>
  );
}

export default Reservation;
