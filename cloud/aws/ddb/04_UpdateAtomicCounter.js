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
    "title": title
  },
  UpdateExpression: "set info.rating = info.rating + :val",
  ExpressionAttributeValues: {
    ":val": 1
  },
  ReturnValues: "UPDATED_NEW"
};

console.log("Updating the item...");

docClient.update(params, (err, data) => {
  if (err) {
    console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
  } else {
    console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
  }
});