module.exports.USERS_API_URL = "http://localhost:3001";
module.exports.QUESTIONS_API_URL = "http://localhost:3002";

const ROOT_URL = "http://localhost:3000";

module.exports.URLS = {
  root: ROOT_URL,
  signup: ROOT_URL + "/signup",
  login: ROOT_URL + "/login",
  logout: ROOT_URL + "/logout",
  collab: ROOT_URL + "/collaborationpage",
  questions: ROOT_URL + "/questionpage",
};

module.exports.TIMEOUT = 30 * 1000;

module.exports.TEST_USER_1 = {
  username: "testuser1",
  email: "testuser1@example.com",
  password: "testPassword1",
};

module.exports.TEST_USER_2 = {
  username: "testuser2",
  email: "testuser2@example.com",
  password: "testPassword2",
};

module.exports.TEST_QUESTION = {
  title: "Test Title",
  description: "Lorem ipsum lorem sit amet",
  categories: "TEST",
  complexity: "Easy",
  link: "http://localhost",
};
