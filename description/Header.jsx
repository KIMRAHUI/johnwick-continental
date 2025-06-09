import './Header.css';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

function Header() {
  const location = useLocation(); // ✅ 현재 경로 정보를 가져와 현재 페이지와 메뉴 링크 비교
  const [menuOpen, setMenuOpen] = useState(false); // ✅ 햄버거 메뉴 열림 여부 상태

  const toggleMenu = () => setMenuOpen(!menuOpen); // ✅ 햄버거 메뉴 열기/닫기 토글
  const closeMenu = () => setMenuOpen(false);       // ✅ 메뉴 클릭 시 자동 닫힘 처리

  return (
    <header className="header">
      <div className="header-container">
        {/* ✅ 로고 클릭 시 홈으로 이동 */}
        <Link to="/" className="logo">
          The Continental
        </Link>

        {/* ✅ 햄버거 메뉴 아이콘 (모바일 화면용) */}
        <div className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}>
          <span />
          <span />
          <span />
        </div>

        {/* ✅ 내비게이션 메뉴 (햄버거 클릭 시 열림) */}
        <nav className={`nav ${menuOpen ? 'active' : ''}`}>
          <div className="nav-links">
            {/* ✅ 현재 경로와 비교하여 활성 메뉴 표시 (className에 'active') */}
            <Link
              to="/"
              onClick={closeMenu}
              className={location.pathname === '/' ? 'active' : ''}
            >
              Home
            </Link>
            <Link
              to="/reservation"
              onClick={closeMenu}
              className={location.pathname === '/reservation' ? 'active' : ''}
            >
              Reservation
            </Link>
            <Link
              to="/facilities"
              onClick={closeMenu}
              className={location.pathname.startsWith('/facilities') ? 'active' : ''}
            >
              Facilities
            </Link>
            <Link
              to="/support"
              onClick={closeMenu}
              className={location.pathname === '/support' ? 'active' : ''}
            >
              Support
            </Link>
            <Link
              to="/location"
              onClick={closeMenu}
              className={location.pathname === '/location' ? 'active' : ''}
            >
              Location
            </Link>
            <Link
              to="/board"
              onClick={closeMenu}
              className={location.pathname === '/board' ? 'active' : ''}
            >
              Board
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
