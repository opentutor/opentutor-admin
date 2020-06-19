// import axios from "axios";

// const config = {
//   CMI5_ENDPOINT: process.env.CMI5_ENDPOINT || "/lrs/xapi",
//   CMI5_FETCH: process.env.CMI5_FETCH || "/lrs/auth/guesttoken",
//   MENTOR_API_URL: process.env.MENTOR_API_URL || "/mentor-api", // eslint-disable-line no-undef
//   MENTOR_VIDEO_URL: process.env.MENTOR_VIDEO_URL || "/videos",
// };

// /*
// This is a hacky place and means to get a server-configured
// override of VIDEO_HOST.
// It exists (at least for now), exclusively to enable
// dev-local clients where mentor videos are being polished
// to test serving those videos
// */
// if (typeof window !== "undefined" && process.env.NODE_ENV !== "test") {
//   // i.e. don't run at build time
//   axios
//     .get(`/config`)
//     .then(result => {
//       if (typeof result.data["CMI5_ENDPOINT"] === "string") {
//         config.CMI5_ENDPOINT = result.data["CMI5_ENDPOINT"];
//       }
//       if (typeof result.data["CMI5_FETCH"] === "string") {
//         config.CMI5_FETCH = result.data["CMI5_FETCH"];
//       }
//       if (typeof result.data["MENTOR_API_URL"] === "string") {
//         config.MENTOR_API_URL = result.data["MENTOR_API_URL"];
//       }
//       if (typeof result.data["MENTOR_VIDEO_URL"] === "string") {
//         config.MENTOR_VIDEO_URL = result.data["MENTOR_VIDEO_URL"];
//       }
//     })
//     .catch(err => {
//       console.error(err);
//     });
// }

// export default config;
