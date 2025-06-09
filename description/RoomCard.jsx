function RoomCard({ room, onSelect }) {
  // ✅ room 객체에서 필요한 속성 추출
  const { title, description, price, image } = room;

  return (
    <div className="room-card">
      {/* ✅ 객실 이미지 표시 */}
      <img src={image} alt={title} className="room-image" />

      <div className="room-info">
        {/* ✅ 객실 제목 */}
        <h3>{title}</h3>

        {/* ✅ 객실 설명 (줄바꿈 포함) */}
        <p className="desc">
          {description.split('\n').map((line, idx) => (
            <span key={idx}>
              {line}
              <br />
            </span>
          ))}
        </p>

        {/* ✅ 객실 가격 정보 */}
        <p className="price">1박 {price} 금화</p>

        {/* ✅ 예약하기 버튼 (onSelect 콜백 실행) */}
        <button className="book-button" onClick={onSelect}>
          예약하기
        </button>
      </div>
    </div>
  );
}

export default RoomCard;
