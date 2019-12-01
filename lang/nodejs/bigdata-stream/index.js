"use strict";
// -------------------- Create Transformer in Stream ---------------------- //

const { Transform } = require("stream");
const LineTransformer = class LineTransformer extends Transform {
  constructor(options = {}) {
    super({ ...options, objectMode: true });
  }

  _transform(chunk, encoding, callback) {
    const element = chunk;
    const line =
      [element._id, element.label, element.index, element.createdAt].join(",") +
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
        console.log("finished to write into stream");
        resolve();
      })
      .on("error", err => {
        reject(err);
      });
  });

// -------------------- Prepare -> Transform -> Dump ---------------------- //

console.log(new Date().toISOString(), "Started");

const MAX_COUNT = 2000000;
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

console.log(new Date().toISOString(), "Prepare finished");
console.log(new Date().toISOString(), "Start to dump...");

const pathToDump = "./awesome-transformed-01.txt";
createFilePromise(data, pathToDump)
  .then(() => {
    console.log("Dump to file:", pathToDump);
    console.log(new Date().toISOString(), "Finished");
  })
  .catch(err => {
    console.log("Got error:", err);
  });
