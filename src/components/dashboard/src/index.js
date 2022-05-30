import "./style.scss";
import MainDash from "./components/MainDash";
import RightSide from "./components/RigtSide";
import Sidebar from "./components";
import { useState } from "react";
import PostReportPage from "../../pages/PostReportPage";
import CommentReportPage from "components/pages/CommentReportPage";
import AccountReportPage from "components/pages/AccountReportPage";

const Dashboard = () => {
  const [selected, setSelected] = useState(0);

  return (
    <div className="Dashboard">
      <div className="AppGlass">
        <Sidebar setSelected={setSelected} selected={selected} />
        {selected == 0 && <MainDash />}
        {selected == 1 && <PostReportPage />}
        {selected == 2 && <CommentReportPage />}
        {selected == 3 && <AccountReportPage />}
        {/* <RightSide /> */}
      </div>
    </div>
  );
};

export default Dashboard;
