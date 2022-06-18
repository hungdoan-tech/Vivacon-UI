import React, { useState } from "react";
import "./style.scss";
import "react-circular-progressbar/dist/styles.css";
import { motion, AnimateSharedLayout } from "framer-motion";
import { UilTimes } from "@iconscout/react-unicons";
import Chart from "react-apexcharts";
import { PERIOD } from "../../../../../constant/types";
import classNames from "classnames";
import { ClickAwayListener, Typography } from "@mui/material";

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
  console.log({ param });
  const [currentPeriod, setCurrentPeroid] = useState(PERIOD.MONTHS);
  const data = {
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: param.time,
        labels: {
          style: {
            fontSize: "12px",
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            fontSize: "14px !important",
          },
        },
      },
      tooltip: {
        enabled: true,
      },
      fill: {
        colors: [param.color.chartColor],
        type: "gradient",
        gradient: {
          shade: "light",
          type: "horizontal",
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [20, 40, 100],
        },
      },
      legend: {
        position: "bottom",
        offsetX: 0,
        offsetY: 50,
      },
    },
  };

  const handleClickPeriod = (type) => {
    setSummaryPeriod(type);
    setCurrentPeroid(type);
  };

  const peroidClassName = (type) =>
    classNames({
      active: currentPeriod === type,
    });

  return (
    <motion.div
      className="ExpandedCard"
      style={{
        background: "white",
        boxShadow: param.color.boxShadow,
        "--chartColor": param.color.chartColor,
      }}
      layoutId="expandableCard"
    >
      <ClickAwayListener onClickAway={setExpanded}>
        <div style={{ flex: 1 }}>
          <div className="ChartHeader">
            <span className="Title">{param.title}</span>

            <div className="homepage__summary-filter-wrapper">
              <div
                onClick={() => {
                  handleClickPeriod(PERIOD.MONTHS);
                }}
                className={peroidClassName(PERIOD.MONTHS)}
              >
                <span>Month</span>
              </div>
              <div
                onClick={() => {
                  handleClickPeriod(PERIOD.QUARTERS);
                }}
                className={peroidClassName(PERIOD.QUARTERS)}
              >
                <span>Quarter</span>
              </div>
              <div
                onClick={() => {
                  handleClickPeriod(PERIOD.YEARS);
                }}
                className={peroidClassName(PERIOD.YEARS)}
              >
                <span>Year</span>
              </div>
            </div>
            <div className="CloseCardIcon">
              <UilTimes onClick={setExpanded} />
            </div>
          </div>
          <div className="chartContainer">
            <Chart
              options={data.options}
              series={param.series}
              type="bar"
              width="700"
              style={{ marginTop: "20px" }}
            />
          </div>
        </div>
      </ClickAwayListener>
    </motion.div>
  );
}

export default Card;
