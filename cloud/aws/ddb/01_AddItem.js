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
  Item: {
    "year": year,
    "title": title,
    "info": {
      "plot": "Nothing happens at all.",
      "rating": 0
    }
  }
};

console.log("Adding a new item...");
docClient.put(params, (err, data) => {
  if (err) {
    console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
  } else {
    console.log("Added item:", JSON.stringify(data, null, 2));
  }
});