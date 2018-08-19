# DynamoDBを舐める

チュートリアル: https://docs.aws.amazon.com/ja_jp/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.html

ローカルマシンのTerminalから弄るので、アクセスキーとシークレットキーを使ってます。Elastic BeanstalkやECS, Lambadaから弄る時はIAMでロールを作ってから操作しましょう。

## DynamoDB

### テーブル作成

テーブルを作成してみます。
`aws configure`で設定していない時は認証失敗して以下のように弾かれるんですね。うまくいったときは`data`に結果が全て入っていると。
正直プログラムからテーブル作るよりもCloudFormationでテーブル作成したほうが冪等性の担保とソース管理がしやすいので個人的にはこっちの方が好みです。

```json
// 認証失敗
{
  "message": "The security token included in the request is invalid.",
  "code": "UnrecognizedClientException",
  "time": "2018-08-19T09:03:53.473Z",
  "requestId": "SVANMBETVBO11DHOKS8A45GRTVVV4KQNSO5AEMVJF66Q9ASUAAJG",
  "statusCode": 400,
  "retryable": false,
  "retryDelay": 41.39762357028852
}

// 認証成功
Created table. Table description JSON: {
  "TableDescription": {
    "AttributeDefinitions": [
      {
        "AttributeName": "title",
        "AttributeType": "S"
      },
      {
        "AttributeName": "year",
        "AttributeType": "N"
      }
    ],
    "TableName": "Movies",
    "KeySchema": [
      {
        "AttributeName": "year",
        "KeyType": "HASH"
      },
      {
        "AttributeName": "title",
        "KeyType": "RANGE"
      }
    ],
    "TableStatus": "CREATING",
    "CreationDateTime": "2018-08-19T09:04:50.440Z",
    "ProvisionedThroughput": {
      "NumberOfDecreasesToday": 0,
      "ReadCapacityUnits": 10,
      "WriteCapacityUnits": 10
    },
    "TableSizeBytes": 0,
    "ItemCount": 0,
    "TableArn": "arn:aws:dynamodb:ap-northeast-1:284677944563:table/Movies",
    "TableId": "b5086ea3-11b7-4f0c-b0aa-933e2be38079"
  }
}
```

### テーブルに初期データをロード

次にサンプルのデータをロードします。WCU=10なので、1件ずつデータをロードするときは理論値としては10 * 1KB 書き込み/sec できるはず。
全部で4612件(3632KB)のJSONを1件ずつ`Array.forEach`で突っ込んでいると、結果的には途中まで進んだところで `ProvisionedThroughputExceededException` で弾かれるようになりました。200件ほどエラーで弾かれていますね。

```shell
$ node MovieLoadData.js
...
PutItem succeeded: Of Human Bondage
Unable to add movie 200 Cartas . Error JSON: {
  "message": "The level of configured provisioned throughput for the table was exceeded. Consider increasing your provisioning level with the UpdateTable API.",
  "code": "ProvisionedThroughputExceededException",
  "time": "2018-08-19T09:21:50.335Z",
  "requestId": "OG9EONR7I6GNIRCSL57FKR8CTRVV4KQNSO5AEMVJF66Q9ASUAAJG",
  "statusCode": 400,
  "retryable": true
}

$ aws dynamodb describe-table --table Movies
# ロードされた項目数が表示される. 
...
"TableSizeBytes": 1991251,
"ItemCount": 4365,
...
```

### CRUD操作

SDKにはCRUD用のAPIが用意されているので、ありがたく使わせてもらいます。
実際のプロジェクトで使うなら生のSDKをそのまま書くんじゃなくて、プロジェクト共通のUtilityとしてラップした関数を作って提供してあげたほうが各開発者には優しいかも。

`UpdateExpression`, `ExpressionAttributeValues`のところが自然言語のようなJPAっぽくて気持ちわるいですね。

### 検索操作

- Query
   - プライマリーキー(パーティションキー: 項目全体でなるべく分散する値 + ソートキー: パーティションキーで引っ掛けた項目をソートする値)で検索する。

- Scan
   - テーブル全体の項目を返す。
   - デフォルトだとテーブル全体で1MB読みこむ。1MB以上あっても1MBしか読みこまない(全部返すんじゃないんかい)
   - 結果セットのフィルタリングができますが、全部読み込んでからフィルタリングで不要なデータを捨てる挙動みたいですね。
   - ベストプラクティスとしては、`Limit`宣言で読みこむ件数にキャップをかけること。

参考: https://docs.aws.amazon.com/ja_jp/amazondynamodb/latest/developerguide/bp-query-scan.html

---

使ってみた感想としては、AWS上で使うNoSQLとしては面白い選択肢ですね。  

テーブルサイズに上限がないとはいえキャパシティユニットのキャパプラをしておかないとすぐスロットルするから、AutoScalingを有効化するのが最初は無難かもしれません。
あとはユースケースを見極めてテーブル設計すればRDBよりも素早いレスポンスで使えそう。
