const AWS = require('aws-sdk');

AWS.config.update({
  region: "ap-northeast-1",
  endpoint: "https://dynamodb.ap-northeast-1.amazonaws.com"
});

const dynamodb = new AWS.DynamoDB();

const params = {
  TableName: "Movies"
};

dynamodb.deleteTable(params, (err, data) => {
  if (err) {
    console.log("Unable to delete table. Error JSON:", JSON.stringify(err, null, 2));
  } else {
    console.log("Deleted table. Table description JSON:", JSON.stringify(data, null, 2));
  }
});