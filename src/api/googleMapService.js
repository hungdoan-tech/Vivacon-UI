import axios from "axios";
const google = window.google;

export const getLatLng = async (callback) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(callback);
  }
};

export const getLocationInformation = async ({ latitude, longitude }) => {
  return await axios.get(`http://api.geonames.org/countryCodeJSON`, {
    params: {
      lat: `${latitude}`,
      lng: `${longitude}`,
      username: "nguyentruc",
    },
  });
};

// console.log(process.env.REACT_APP_GOOGLE_MAP_API_URL, process.env.REACT_APP_GOOGLE_MAP_KEY)
// return await axios.get(
//   `${process.env.REACT_APP_GOOGLE_MAP_API_URL}/geocode/json`,
//   {
//     params: {
//       latlng: `${position.coords.latitude},${position.coords.longitude}`,
//       sensor: true,
//       key: process.env.REACT_APP_GOOGLE_MAP_KEY,
//     },
//   }
// );
