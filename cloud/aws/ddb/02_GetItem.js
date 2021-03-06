const AWS = require("aws-sdk");

AWS.config.update({
  region: "ap-northeast-1",
  endpoint: "https://dynamodb.ap-northeast-1.amazonaws.com"
});

const docClient = new AWS.DynamoDB.DocumentClient();
const table = "Movies";
const year = 2015;
const title = "The Big New Movie";

const params = {
  TableName: table,
  Key: {
    "year": year,
    "title": title,
  }
};

docClient.get(params, (err, data) => {
  if (err) {
    console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
  } else {
    console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
  }
});