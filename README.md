# 🏨 John Wick Continental - 프론트엔드

존윅 세계관을 기반으로 한 호텔 예약 서비스 웹앱입니다. 고객은 실제 호텔처럼 객실 및 전용 서비스를 선택해 예약할 수 있으며, 통계 그래프, 위치 정보, 커뮤니티 게시판 등 다양한 기능을 제공합니다.

---

## 🛠️ 기술 스택

- Frontend Framework: React (Vite 기반)
- Routing: React Router DOM
- Chart: Chart.js + react-chartjs-2
- 지도 라이브러리: Leaflet + OpenStreetMap
- 스타일링: CSS 모듈화
- 애니메이션: css기반 사용자 정의 모달
- 기타: localStorage 활용, 다단계 예약 상태 전달

---

## ✨ 주요 기능

- ✅ 객실/서비스 선택 기반 예약 프로세스 (4단계)
- ✅ 비밀 코드 입력 기반의 VIP 서비스 잠금 해제
- ✅ 선택 옵션/기간/인원에 따른 실시간 요금 계산
- ✅ Leaflet 기반 호텔 및 현상수배자 위치 표시
- ✅ 커뮤니티형 리뷰 게시판 (등록/수정/삭제)
- ✅ 고객센터 FAQ 실시간 필터링 검색
- ✅ Chart.js 기반의 투숙객 통계 시각화

---

## 📁 프로젝트 구조
```
📦src
┣ 📂assets // 이미지, 아이콘, 지도 마커 등
┣ 📂components // 공통 컴포넌트 (Header, Footer, Modal 등)
┣ 📂pages
┃ ┣ 📂Reservation // 예약 단계별 페이지 (Step1~4)
┃ ┣ 📂Facilities // 시설 리스트 및 상세 페이지
┃ ┣ 📂Board // 게시판 목록/글쓰기/상세
┃ ┗ 📂Support, Location // 고객센터 및 위치 페이지
┣ 📂data // dummy JSON 데이터 (facilityData 등)
┣ 📂styles // CSS 파일
┗ 📜main.jsx // 진입점

```
