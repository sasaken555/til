# CSVファイルをCloudantに一括ロード

* ファイルからそのままロードすることはできないので、プログラム側からロードしてあげる。
  * ロードする際には1件ずつだと効率が悪すぎるし負荷が高い。
  * CloudantのBulkロード用のAPIを使う。

```javascript
deals.bulk({ docs: docs }, (err, body) => {
  if (err) {
    console.error(err);
  }
  // 挿入した結果ステータスを返す
  console.log(body);
});
```

* CSV --> JSONに変換
  * CSVのままではロード不可。JSONに変換。
  * Node.jsなら[csvtojson](https://www.npmjs.com/package/csvtojson)を使う。

* レコード数を区切ってロード
  * 数千件オーダーを超えると、413 Request Too Largeのエラーで弾かれる。
  * 1,000だとロードできるが、ちょっと怖いので500件ずつだと安心して実行できた。これで7,700件ロードしたけど問題なし。

```javascript
// 配列分割の事前準備
const range = 500; // 分割するまとまりの数

// 500個ずつに分割してロード
csv()
  .fromFile(csvFilePath)
  .then((jsonObj) => {
    for (let i = 0; i < Math.ceil(jsonObj.length / range); i++) {
      const j = i * range; // 始点のIndex
      const jsons = jsonObj.slice(j, j + range);
      bulkInsert(jsons);
    }
  });
```
