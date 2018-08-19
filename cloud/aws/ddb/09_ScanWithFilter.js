const AWS = require("aws-sdk");
AWS.config.update({
  region: "ap-northeast-1",
  endpoint: "https://dynamodb.ap-northeast-1.amazonaws.com"
});

const docClient = new AWS.DynamoDB.DocumentClient();
console.log("Scaning for Movies in 1950s.");

const params = {
  TableName: "Movies",
  ProjectionExpression: "#yr, title, info.rating",
  FilterExpression: "#yr between :start_yr and :end_yr",
  ExpressionAttributeNames: {
    "#yr": "year"
  },
  ExpressionAttributeValues: {
    ":start_yr": 1950,
    ":end_yr": 1959,
  }
};

/* テーブルスキャン関数 */
const onScan = (err, data) => {
  if (err) {
    console.error("Unable to scam. Error:", JSON.stringify(err, null, 2));
  } else {
    console.log("Scan succeeded.");
    // 最初の1MBをスキャン
    data.Items.forEach(movie => {
      console.log(`${movie.year}: ${movie.title} - ${movie.info.rating}`);
    });
    console.log(data);

    // 1MB読み込んだ後にもう一度1MBをスキャンする
    if (typeof data.LastEvaluatedKey != "undefined") {
      console.log("Scanning for more...");
      params.ExclusiveStartKey = data.LastEvaluatedKey;
      docClient.scan(params, onScan);
      console.log(data);
    }
  }
}

// スキャン実行
docClient.scan(params, onScan);