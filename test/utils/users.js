// general utility methods for common tasks

module.exports.getNewTestUser = (function(n) {
  return function() {
    n += 1;
    return {
      username: `testuser${n}`,
      email: `testuser${n}@example.com`,
      password: "password",
    };
  }
}(0));
