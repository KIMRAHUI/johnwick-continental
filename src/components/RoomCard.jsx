function RoomCard({ room, onSelect }) {
  const { title, description, price, image } = room;

  return (
    <div className="room-card">
      <img src={image} alt={title} className="room-image" />
      <div className="room-info">
        <h3>{title}</h3>
        <p className="desc">
          {description.split('\n').map((line, idx) => (
            <span key={idx}>{line}<br /></span>
          ))}
        </p>
        <p className="price">1박 {price} 금화</p>
        <button className="book-button" onClick={onSelect}>
          예약하기
        </button>
      </div>
    </div>
  );
}

export default RoomCard;
