import './style.scss'
import MainDash from './components/MainDash';
import RightSide from './components/RigtSide';
import Sidebar from './components';

const Dashboard = () => {
  return (
    <div className="Dashboard">
      <div className="AppGlass">
        <Sidebar/>
        <MainDash/>
        <RightSide/>
      </div>
    </div>
  );
}

export default Dashboard;
