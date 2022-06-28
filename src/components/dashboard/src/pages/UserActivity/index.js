import { Button, Typography } from "@mui/material";
import { getLatLng, getLocationInformation } from "api/googleMapService";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  useZoomPan,
} from "react-simple-maps";
import ReactTooltip from "react-tooltip";
import "./style.scss";
const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

// [long, lat]
const markers = [
  {
    markerOffset: -30,
    name: "Buenos Aires",
    coordinates: [106.6645122, 10.7366721],
  },
  { markerOffset: 15, name: "La Paz", coordinates: [107.6645122, 10.866721] },
  { markerOffset: 15, name: "Brasilia", coordinates: [100.6645122, 9.7366721] },
  { markerOffset: 15, name: "Santiago", coordinates: [-70.6693, -33.4489] },
  { markerOffset: 15, name: "Bogota", coordinates: [-74.0721, 4.711] },
  { markerOffset: 15, name: "Quito", coordinates: [-78.4678, -0.1807] },
  { markerOffset: -30, name: "Georgetown", coordinates: [-58.1551, 6.8013] },
  { markerOffset: -30, name: "Asuncion", coordinates: [-57.5759, -25.2637] },
  { markerOffset: 15, name: "Paramaribo", coordinates: [-55.2038, 5.852] },
  { markerOffset: 15, name: "Montevideo", coordinates: [-56.1645, -34.9011] },
  { markerOffset: 15, name: "Caracas", coordinates: [-66.9036, 10.4806] },
  { markerOffset: 15, name: "Lima", coordinates: [-77.0428, -12.0464] },
];

const width = 800;
const height = 600;

const CustomZoomableGroup = ({ children, ...restProps }) => {
  const { mapRef, transformString, position } = useZoomPan(restProps);
  return (
    <g ref={mapRef}>
      <rect width={width} height={height} fill="transparent" />
      <g transform={transformString}>{children(position)}</g>
    </g>
  );
};

const UserActivity = () => {
  const [tooltipContent, setTooltipContent] = useState("");
  const [group, setGroup] = useState([]);
  const [chartConfig, setChartConfig] = useState({
    series: [
      {
        data: [],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      fill: {
        colors: "rgba(238, 133, 133)",
      },
      xaxis: {
        categories: [],
      },
    },
  });

  useEffect(async () => {
    await handleGroupMarkers();
  }, []);

  const handleGroupMarkers = async () => {
    let resultsList = [];
    await Promise.all(
      markers.map((mark, markIndex) => {
        getLocationInformation({
          latitude: mark.coordinates[1],
          longitude: mark.coordinates[0],
        }).then(({ data: res }) => {
          console.log({ res: res.countryName });
          if (!resultsList.find((item) => item.country === res.countryName)) {
            resultsList.push({ country: res.countryName, marksList: [mark] });
          } else {
            const existedItem = resultsList.filter(
              (item) => item.country === res.countryName
            )[0];
            const index = resultsList.indexOf(existedItem);
            resultsList[index].marksList.push(mark);
          }
          if (markIndex === markers.length - 1) {
            setGroup(resultsList);
          }
        });
      })
    );
  };

  useEffect(() => {
    if (group.length > 0) {
      console.log("Group", group);
    }
  }, [group]);

  useEffect(() => {
    if (group.length > 0) {
      const data = group.slice(0, 5).map((item) => {
        return item.marksList?.length;
      });
      const categories = group.slice(0, 5).map((item) => {
        return item.country || "None";
      });
      const config = { ...chartConfig };
      config.series = [{ data }];
      config.options.xaxis.categories = categories;
      setChartConfig(config);
    }
  }, [group]);

  const areaChartConfig = {
    series: [
      {
        name: "series1",
        data: [31, 40, 28, 51, 42, 109, 100],
      },
      // {
      //   name: "series2",
      //   data: [11, 32, 45, 32, 34, 52, 41],
      // },
    ],
    options: {
      chart: {
        height: 350,
        type: "area",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        colors: ["transparent"],
      },
      fill: {
        colors: ["rgba(96, 170, 255, 0.82)"],
        type: "gradient",
        gradient: {
          shade: "light",
          type: "horizontal",
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [30, 99, 100],
        },
      },
      xaxis: {
        type: "datetime",
        categories: [
          "2018-09-19T00:00:00.000Z",
          "2018-09-19T01:30:00.000Z",
          "2018-09-19T02:30:00.000Z",
          "2018-09-19T03:30:00.000Z",
          "2018-09-19T04:30:00.000Z",
          "2018-09-19T05:30:00.000Z",
          "2018-09-19T06:30:00.000Z",
        ],
      },
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm",
        },
      },
    },
  };

  return (
    <Typography component="div" className="user-activity-container">
      <Typography component="div" className="user-activity-charts">
        <Typography component="div" className="user-activity-analysis">
          <Typography component="div" className="top-country chart">
            <Typography className="header">Top Popular country</Typography>
            <Typography className="chart-content">
              {chartConfig &&
                chartConfig.options.xaxis.categories.length > 0 && (
                  <ReactApexChart
                    options={chartConfig.options}
                    series={chartConfig.series}
                    type="bar"
                    height={250}
                  />
                )}{" "}
            </Typography>
          </Typography>

          <Typography component="div" className="user-logged-in-hours chart">
            <Typography className="header">User Logged-in Hours</Typography>
            <Typography className="chart-content">
              <ReactApexChart
                options={areaChartConfig.options}
                series={areaChartConfig.series}
                type="area"
                height={250}
              />
            </Typography>
          </Typography>
        </Typography>
        <Typography component="div" className="user-activity-map-container">
          <Typography component="div" className="user-activity-map chart">
            <Typography className="header">
              User density by Country{" "}
              <Typography componnent="div" className="legend-container">
                <Typography
                  componnent="div"
                  className="legend-dot"
                ></Typography>
                <Typography componnent="div" className="legend-name">
                  {markers.length} users
                </Typography>
              </Typography>
            </Typography>
            <Typography className="chart-content">
              <ComposableMap data-tip="" projection="geoMercator">
                <CustomZoomableGroup center={[0, 0]} zoom={0.65}>
                  {(position) => (
                    <>
                      <Geographies geography={geoUrl}>
                        {({ geographies }) =>
                          geographies.map((geo) => (
                            <Geography
                              key={geo.rsmKey}
                              geography={geo}
                              fill="#EAEAEC"
                              stroke="#D6D6DA"
                              onMouseEnter={() => {
                                console.log({ group });
                                const { NAME, POP_EST } = geo.properties;
                                setTooltipContent(
                                  `${NAME} — ${
                                    group.filter(
                                      (item) => item.country === NAME
                                    )[0]?.marksList.length || 0
                                  } user`
                                );
                              }}
                              onMouseLeave={() => {
                                setTooltipContent("");
                              }}
                              style={{
                                default: {
                                  fill: "#D6D6DA",
                                  outline: "none",
                                },
                                hover: {
                                  fill: "#F53",
                                  outline: "none",
                                },
                                pressed: {
                                  fill: "#E42",
                                  outline: "none",
                                },
                              }}
                            />
                          ))
                        }
                      </Geographies>
                      {markers.map(({ name, coordinates, markerOffset }) => (
                        <Marker key={name} coordinates={coordinates}>
                          <circle
                            r={5 / position.k}
                            fill="#F00"
                            stroke="#fff"
                            strokeWidth={2 / position.k}
                          />
                        </Marker>
                      ))}{" "}
                    </>
                  )}
                </CustomZoomableGroup>
              </ComposableMap>
            </Typography>
          </Typography>
          <ReactTooltip>{tooltipContent}</ReactTooltip>
        </Typography>{" "}
      </Typography>
    </Typography>
  );
};

export default UserActivity;
