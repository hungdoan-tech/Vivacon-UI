import React from "react";
import Cards from "../Cards";
import Table from "../Table";
import moment from "moment";
import "./style.scss";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import Carousel from "react-material-ui-carousel";

const OverallDashboard = ({
  statisticData,
  newestPostData,
  postInteractionData,
  statisticByTime,
  summaryPeriod,
  setSummaryPeriod,
}) => {
  return (
    <div className="MainDash">
      <div className="homepage-bg">
        <img
          src={require("../../../../../assets/img/wave-bg.svg")}
          alt="background"
        />
      </div>

      <div className="homepage__hero">
        <Cards
          statisticData={statisticData}
          statisticByTime={statisticByTime}
          summaryPeriod={summaryPeriod}
          setSummaryPeriod={setSummaryPeriod}
        />
        <div className="homepage__top-cards slide-container">
          <Slide
            duration={5000}
            prevArrow={
              <div className="card__btn card__btn-prev">
                <i className="bx bx-chevron-left" />
              </div>
            }
            nextArrow={
              <div className="card__btn card__btn-next">
                <i className="bx bx-chevron-right" />
              </div>
            }
          >
            {postInteractionData.map((item, index) => (
              <div
                className="homepage__top-card each-slide"
                key={index}
                onClick={() => {
                  // navigate(`/innovation/${item.id}`);
                }}
              >
                <div className="homepage__top-card-header">
                  <div className="homepage__top-card-avatar-box">
                    <div className="homepage__top-card-avatar-bg">
                      <div className="homepage__top-card-avatar-bg">
                        <div className="homepage__top-card-avatar-bg">
                          <img src={item.url} alt="user" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="homepage__top-card-user-box">
                    <span>{item.userName}</span>
                  </div>
                </div>
                <div className="homepage__top-card-body">
                  <span>
                    <i className="bx bxs-time-five" />
                    {moment(item.createdAt).format("DD/MM/YYYY")}
                  </span>
                </div>
                <div className="homepage__top-card-footer">
                  <div className="homepage__top-card-chip">
                    <span>Total comment: {item.totalComment}</span>
                  </div>
                  <div className="homepage__top-card-chip">
                    <span>Total like: {item.totalLike}</span>
                  </div>
                  <div className="homepage__top-card-chip">
                    <span>Total interaction: {item.totalInteraction}</span>
                  </div>
                </div>
                <div className="homepage__top-card-img">
                  <h3>{item.caption}</h3>
                  <Carousel autoPlay={false} className="details-carousel">
                    {item.lstAttachmentDTO?.map((item, i) => (
                      <img key={i} src={item.url} alt="" />
                    ))}
                  </Carousel>
                </div>
              </div>
            ))}
          </Slide>
        </div>
      </div>

      <Table newestPostData={newestPostData} />
    </div>
  );
};

export default OverallDashboard;
