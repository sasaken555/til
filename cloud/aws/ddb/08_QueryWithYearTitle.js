const AWS = require("aws-sdk");
AWS.config.update({
  region: "ap-northeast-1",
  endpoint: "https://dynamodb.ap-northeast-1.amazonaws.com"
});

const docClient = new AWS.DynamoDB.DocumentClient();
console.log("Querying for movies from 1992 with First Letter A-L.");

const params = {
  TableName: "Movies",
  ProjectionExpression: "#yr, title, info.genres, info.actors[0]", // 項目の特定
  KeyConditionExpression: "#yr = :yyyy and title between :letter1 and :letter2", // 検索キー条件
  ExpressionAttributeNames: { // 予約語はこれで置き換える.
    "#yr": "year"
  },
  ExpressionAttributeValues: { // KeyConditionExpressionの値の置き換え
    ":yyyy": 1992,
    ":letter1": "A",
    ":letter2": "L"
  }
};

docClient.query(params, (err, data) => {
  if (err) {
    console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
  } else {
    console.log("Query succeeded.");
    data.Items.forEach(item => {
      console.log(` -${item.year}: ${item.title} ... ${item.info.genres} ... ${item.info.actors[0]}`);
    });
  }
});