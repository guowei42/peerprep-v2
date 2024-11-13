module.exports.USERS_API_URL = "http://localhost:3001";
module.exports.QUESTIONS_API_URL = "http://localhost:3002";
module.exports.MATCHING_ENDPOINT = "http://localhost:3003";

const ROOT_URL = "http://localhost:3000/";

module.exports.URLS = {
  root: ROOT_URL,
  signup: ROOT_URL + "signup",
  login: ROOT_URL + "login",
  logout: ROOT_URL + "logout",
  collab: ROOT_URL + "collaborationpage",
  questions: ROOT_URL + "questionpage",
};

module.exports.TEST_QUESTION = {
  title: "Test Title",
  description: "Lorem ipsum lorem sit amet",
  categories: "TEST",
  complexity: "Easy",
  link: "http://localhost",
};
