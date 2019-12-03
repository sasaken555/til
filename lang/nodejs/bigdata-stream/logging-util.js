"use strict";
const log4js = require("log4js");
const createLogger = name => log4js.getLogger(name);

module.exports.createLogger = createLogger;
