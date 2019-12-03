"use strict";
const { createLogger } = require("./logging-util");
const logger = createLogger("sample");
logger.level = "debug";

// -------------------- Create Transformer in Stream ---------------------- //

const { Transform } = require("stream");
const LineTransformer = class LineTransformer extends Transform {
  constructor(options = {}) {
    super({ ...options, objectMode: true });
  }

  _transform(chunk, encoding, callback) {
    const { _id, label, index, createdAt } = chunk;
    const line =
      [_id, label, index, createdAt].join(",") +
      "\n";
    this.push(line);
    callback();
  }
};

// -------------------- Dump file through Stream ---------------------- //

const fs = require("fs");

const createFilePromise = (dataToDump, path) =>
  new Promise((resolve, reject) => {
    const ws = fs.createWriteStream(path, { flags: "a+" });
    const lineTransformer = new LineTransformer();
    const intoStream = require("into-stream");

    intoStream
      .object(dataToDump)
      .pipe(lineTransformer)
      .pipe(ws)
      .on("finish", () => {
        logger.info("finished to write into stream");
        resolve();
      })
      .on("error", err => {
        reject(err);
      });
  });

// -------------------- Prepare -> Transform -> Dump ---------------------- //

logger.info("Started");

const MAX_COUNT = 2000000; // 200万件
const data = [];
for (let di = 0; di < MAX_COUNT; di++) {
  const element = {
    _id: di.toString().padStart(8, "0"),
    label: "asdfghjzxcvbn",
    index: (di + 1).toString().padStart(7, "0"),
    createdAt: new Date().toISOString()
  };
  data.push(element);
}

logger.info("Prepare finished");
logger.info("Start to dump...");

const pathToDump = "./awesome-transformed-01.txt";

(async () => {
  for (let di = 0; di < 3; di++) {
    logger.info(`Iteration ${di + 1}`);
    await createFilePromise(data, pathToDump)
      .then(() => {
        logger.info("Dump to file:", pathToDump);
        logger.info("Finished");
      })
      .catch(err => {
        logger.info("Got error:", err);
      });
  }
})();
