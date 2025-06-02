import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Support from './pages/Support';
import Location from './pages/Location';
import FacilityList from './pages/FacilityList';
import FacilityDetail from './pages/FacilityDetail';
import EmergencyPayment from './pages/EmergencyPayment';
import Board from './pages/Board';
import Step1SelectRoom from './pages/reservation/Step1SelectRoom';
import Step2SelectOptions from './pages/reservation/Step2SelectOptions';
import Step3UserInfo from './pages/reservation/Step3UserInfo';
import Step4Complete from './pages/reservation/Step4Complete';
import Reservation from './pages/Reservation';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/reservation/step1" element={<Step1SelectRoom />} />
        <Route path="/reservation/step2" element={<Step2SelectOptions />} />
        <Route path="/reservation/step3" element={<Step3UserInfo />} />
        <Route path="/reservation/step4" element={<Step4Complete />} />
        <Route path="/support" element={<Support />} />
        <Route path="/location" element={<Location />} />
        <Route path="/facilities" element={<FacilityList />} />
        <Route path="/facilities/:id" element={<FacilityDetail />} />
        <Route path="/emergency-payment" element={<EmergencyPayment />} />
        <Route path="/board" element={<Board />} />
      </Routes>
    </Router>
  );
}

export default App;
