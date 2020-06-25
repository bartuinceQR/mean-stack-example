const path = require("path");
const resolvedPath = path.resolve(__dirname, "..", `.env`);

require("dotenv").config({
  path: resolvedPath
});

module.exports = {
    username: process.env.MONGO_USER,
    password: process.env.MONGO_PASSWORD,
    path: process.env.MONGO_PATH
};