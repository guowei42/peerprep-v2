const http = require("http");
const { USERS_API_URL, QUESTIONS_API_URL } = require("./const");

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

module.exports.deleteAllQuestions = async () => {
  await get(QUESTIONS_API_URL + "/test/deleteAll");
};

module.exports.seedQuestions = async () => {
  await get(QUESTIONS_API_URL + "/test/seed");
};

module.exports.resetQuestions = async () => {
  await get(QUESTIONS_API_URL + "/test/reset");
};
