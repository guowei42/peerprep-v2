const mongoose = require("mongoose");

module.exports.getConn = async (uri) => {
  const conn = await mongoose.createConnection(uri);
  return conn;
};

module.exports.clearAll = async (conn) => {
  const collections = conn.collections;
  await Promise.all(Object.values(collections).map((collection) => collection.deleteMany({})));
};
