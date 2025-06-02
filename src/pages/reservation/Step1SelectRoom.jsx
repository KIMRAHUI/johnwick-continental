import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import './Step1SelectRoom.css';
import deluxe from '../../assets/deluxe.png';
import assassin from '../../assets/assassin.png';
import blackroom from '../../assets/blackroom.png';
import bunker from '../../assets/bunker.png';
import penthouse from '../../assets/penthouse.png';
import silentRoom from '../../assets/silent-room.png';

function Step1SelectRoom() {
  const navigate = useNavigate();
  
    useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [])



  // 실시간 객실 수 (예시)
  const roomAvailability = {
    '디럭스 스위트': 3,
    '암살자 은신처': 2,
    '블랙 룸': 1,
    '콘티넨탈 벙커': 2,
    '하이 테이블 펜트하우스': 1,
    '사일런트 쿼터스': 4,
  };

  const roomList = [
    {
      title: '디럭스 스위트',
      image: deluxe,
      price: 15,
      maxPeople: 2,
      description: '방음 설계와 신분 세탁 통로 포함.',
    },
    {
      title: '암살자 은신처',
      image: assassin,
      price: 20,
      maxPeople: 2,
      description: '은밀한 이동 경로와 프라이빗 보안 제공.',
    },
    {
      title: '블랙 룸',
      image: blackroom,
      price: 30,
      maxPeople: 2,
      description: '하이테이블 VIP 전용의 완전 독립 공간.',
    },
    {
      title: '콘티넨탈 벙커',
      image: bunker,
      price: 25,
      maxPeople: 4,
      description: '지하 금고 연결, 무기 저장 가능.',
    },
    {
      title: '하이 테이블 펜트하우스',
      image: penthouse,
      price: 40,
      maxPeople: 4,
      description: '최상층 위치, 도시 전경 조망 가능.',
    },
    {
      title: '사일런트 쿼터스',
      image: silentRoom,
      price: 12,
      maxPeople: 1,
      description: '접촉 금지, 격리형 룸. 완전 방음.',
    },
  ];

  const handleSelect = (room) => {
    navigate('/reservation/step2', {
      state: {
        selectedRoom: room.title,
        pricePerNight: room.price,
        availableRooms: roomAvailability[room.title],
        maxPeople: room.maxPeople,
      },
    });
  };

  return (
    <section className="step1-select-room">
      <h2>Step 1: 객실 선택</h2>
      <p>원하시는 객실을 선택하세요. 이용 가능 객실 수는 실시간으로 반영됩니다.</p>
      <div className="room-grid">
        {roomList.map((room) => (
          <div key={room.title} className="room-card">
            <img src={room.image} alt={room.title} className="room-image" />
            <h3>{room.title}</h3>
            <p>{room.description}</p>
            <p className="room-price">1박 {room.price} 금화</p>
            <p className="room-availability">이용 가능 객실 수: {roomAvailability[room.title]}개</p>
            <p className="room-availability">최대 수용 인원: {room.maxPeople}명</p>
            <button className="select-button" onClick={() => handleSelect(room)}>
              선택하기
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Step1SelectRoom;
