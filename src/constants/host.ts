// const pro = !(process.env.NODE_ENV === "development");

let host = "https://ic0.app";

// if (pro) {
//   host = "https://ic0.app";
// } else {
//   host = "http://localhost:8000";
// }

const isIC = host === "https://ic0.app";

export { isIC };

export default host;
