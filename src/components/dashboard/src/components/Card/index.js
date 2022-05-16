import React, { useState } from "react";
import "./style.scss";
import "react-circular-progressbar/dist/styles.css";
import { motion, AnimateSharedLayout } from "framer-motion";
import { UilTimes } from "@iconscout/react-unicons";
import Chart from "react-apexcharts";
import { PERIOD } from "../../../../../constant/types";

// parent Card
const Card = (props) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <AnimateSharedLayout>
      {expanded ? (
        <ExpandedCard
          param={props}
          setExpanded={() => setExpanded(false)}
          setSummaryPeriod={props.setSummaryPeriod}
        />
      ) : (
        <CompactCard param={props} setExpanded={() => setExpanded(true)} />
      )}
    </AnimateSharedLayout>
  );
};

// Compact Card
function CompactCard({ param, setExpanded }) {
  return (
    <motion.div
      className="CompactCard"
      style={{
        background: param.color.backGround,
        boxShadow: param.color.boxShadow,
      }}
      layoutId="expandableCard"
      onClick={setExpanded}
    >
      <div className="radialBar">
        <span>{param.title}</span>
        <span>{param.value} posts</span>
      </div>
    </motion.div>
  );
}

// Expanded Card
function ExpandedCard({ param, setExpanded, setSummaryPeriod }) {
  const data = {
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: param.time,
      },
    },
    series: [
      {
        name: "series-1",
        data: [30, 40, 45, 50, 49, 60, 70, 91],
      },
    ],
  };

  return (
    <motion.div
      className="ExpandedCard"
      style={{
        background: param.color.backGround,
        boxShadow: param.color.boxShadow,
      }}
      layoutId="expandableCard"
    >
      <div style={{ alignSelf: "flex-end", cursor: "pointer", color: "white" }}>
        <UilTimes onClick={setExpanded} />
      </div>
      <span>{param.title}</span>

      <div className="homepage__summary-filter-wrapper">
        <div
          onClick={() => {
            setSummaryPeriod(PERIOD.MONTHS);
          }}
        >
          <span>Month</span>
        </div>
        <div
          onClick={() => {
            setSummaryPeriod(PERIOD.QUARTERS);
          }}
        >
          <span>Quarter</span>
        </div>
        <div
          onClick={() => {
            setSummaryPeriod(PERIOD.YEARS);
          }}
        >
          <span>Year</span>
        </div>
      </div>

      <div className="chartContainer">
        <Chart
          options={data.options}
          series={param.series}
          type="bar"
          width="500"
        />
      </div>
    </motion.div>
  );
}

export default Card;
