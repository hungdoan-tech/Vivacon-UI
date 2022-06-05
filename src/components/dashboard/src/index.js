import { useState, useEffect } from "react";
import "./style.scss";
import MainDash from "./components/MainDash";
import RightSide from "./components/RigtSide";
import Sidebar from "./components";
import PostReportPage from "../../pages/PostReportPage";
import CommentReportPage from "components/pages/CommentReportPage";
import AccountReportPage from "components/pages/AccountReportPage";

import {
  getStatisticData,
  getTheTopAccountMostFollowerStatistic,
  getPostQuantityStatisticInMonths,
  getPostQuantityStatisticInQuarters,
  getPostQuantityStatisticInYears,
  getTheTopPostInteraction,
  getPostByNewestCreatedAt,
} from "../../../api/statisticService";
import { PERIOD } from "../../../constant/types";

const Dashboard = () => {
  const [selected, setSelected] = useState(0);
  const [summaryPeriod, setSummaryPeriod] = useState(PERIOD.MONTHS);
  const [statisticByTime, setStatisticByTime] = useState([]);
  const [statisticData, setStatisticData] = useState([]);
  const [newestPostData, setNewestPostData] = useState([]);
  const [postInteractionData, setPostInteractionData] = useState([]);
  const [userAccountMostFollowerData, setUserAccountMostFollowerData] =
    useState([]);

  useEffect(() => {
    if (summaryPeriod === PERIOD.MONTHS) {
      getPostQuantityStatisticInMonths().then((res) =>
        setStatisticByTime(res.data)
      );
    } else if (summaryPeriod === PERIOD.QUARTERS) {
      getPostQuantityStatisticInQuarters().then((res) =>
        setStatisticByTime(res.data)
      );
    } else if (summaryPeriod === PERIOD.YEARS) {
      getPostQuantityStatisticInYears().then((res) =>
        setStatisticByTime(res.data)
      );
    }
  }, [summaryPeriod]);

  useEffect(() => {
    getStatisticData().then((res) => setStatisticData(res.data));
    getPostByNewestCreatedAt({ limit: 5 }).then((res) =>
      setNewestPostData(res.data)
    );
    getTheTopPostInteraction({ limit: 4 }).then((res) =>
      setPostInteractionData(res.data)
    );
    getTheTopAccountMostFollowerStatistic({ limit: 5 }).then((res) =>
      setUserAccountMostFollowerData(res.data)
    );
  }, []);

  return (
    <div className="Dashboard">
      <div className="AppGlass">
        <Sidebar setSelected={setSelected} selected={selected} />
        {selected == 0 && (
          <MainDash
            statisticData={statisticData}
            newestPostData={newestPostData}
            postInteractionData={postInteractionData}
            statisticByTime={statisticByTime}
            summaryPeriod={summaryPeriod}
            setSummaryPeriod={setSummaryPeriod}
          />
        )}
        {selected == 1 && <PostReportPage />}
        {selected == 2 && <CommentReportPage />}
        {selected == 3 && <AccountReportPage />}

        <RightSide userAccountMostFollowerData={userAccountMostFollowerData} />
      </div>
    </div>
  );
};

export default Dashboard;
