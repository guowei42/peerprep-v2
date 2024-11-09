const http = require("http");
const { USERS_API_URL } = require("./const");

const get = async (url) => {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      let data;
      res.on("data", function (d) {
        data += d;
      });
      res.on("end", () => {
        resolve(data);
      });
    });
  });
};

module.exports.deleteAllUsers = async () => {
  await get(USERS_API_URL + "/test/deleteAllUsers");
};
