const AWS = require("aws-sdk");
const fs = require("fs");

AWS.config.update({
  region: "ap-northeast-1",
  endpoint: "https://dynamodb.ap-northeast-1.amazonaws.com"
});

const docClient = new AWS.DynamoDB.DocumentClient();
console.log("Importing movies into DynamoDB. Prease wait...");

const allMovies = JSON.parse(fs.readFileSync("moviedata.json", "utf-8"));
allMovies.forEach(movie => {
  const params = {
    TableName: "Movies",
    Item: {
      "year": movie.year,
      "title": movie.title,
      "info": movie.info,
    }
  };

  docClient.put(params, (err, data) => {
    if (err) {
      console.error("Unable to add movie", movie.title, ". Error JSON:", JSON.stringify(err, null, 2));
    } else {
      console.log("PutItem succeeded:", movie.title);
    }
  });
});